import { LightningElement, track } from 'lwc';

export default class ClientIpAddress extends LightningElement {
    @track ipv4;
    @track ipv6;

    @track copied = {
        ipv4: false,
        ipv6: false
    }

    handleCopy(event) {
        this.showTip(event.target.dataset.name);
        this.copyToClip(event.target.dataset.name);
    }

    connectedCallback() {
        Promise.all([
            fetch('https://api.ipify.org/?format=json'),
            fetch('https://api64.ipify.org/?format=json')
        ])
            .then((result) => {
                return Promise.all([
                    result[0].text(),
                    result[1].text()
                ]);
            })
            .then((result) => {
                this.ipv4 = JSON.parse(result[0]).ip;
                this.ipv6 = JSON.parse(result[1]).ip;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    showTip(name) {
        this.copied[name] = true;
        setTimeout(() => {
            this.copied[name] = false;
        }, 1000);
    }

    copyToClip(name) {
        const el = document.createElement('textarea');
        el.value = this[name];
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }
}