function setupShare() {
    const qr = document.querySelector('.qr-code');
    const share = document.querySelector('.share-code');
    const location = document.querySelector('.location');
    const greeting = document.querySelector('.greeting');

    const shareLoc = window.location.href;

    const service = decodeLockshare(shareLoc);

    share.href = shareLoc;
    qr.src = `https://chart.googleapis.com/chart?cht=qr&chs=256x256&chl=${shareLoc}`;

    getShareInfo(service)
        .then(data => {
            location.innerHTML = data.location;
            greeting.innerHTML = `Hi ${data.name}, `;
        })
        .catch(() => {
            window.location = '/error';
        });
}

function decodeLockshare(shareLoc) {
    const parser = document.createElement('a');
    parser.href = shareLoc;

    const encoded = parser.search.substr(1);
    return atob(encoded);
}

function getShareInfo(service) {
    const name = `_jsonp_callback_${Math.round(Math.random() * 99999)}`;
    const script = document.createElement('script');
    script.src = `${service}&callback=${name}`;

    return new Promise((resolve, reject) => {
        window[name] = resolve;
        document.head.appendChild(script);
        script.addEventListener('error', reject);
    })
        .then(d => {
            document.head.removeChild(script);
            return d;
        });
}

function init() {
    const path = window.location.pathname.split('/')[1];

    switch(path) {
        case 'share':
            setupShare();
            break;
    }
}


init();
