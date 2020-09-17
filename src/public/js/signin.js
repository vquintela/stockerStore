window.onload = () => {
    const message = document.getElementById('message-success');
    if(message) {
        setTimeout(() => {
            message.remove();
        }, 2000)
    }
}

document.getElementById('renewPass').addEventListener('click', () => {
    renewPass();
});

const renewPass = async (e) => {
    const email = document.getElementById('email').value;
    const resp = await fetch('/renew', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email})
    });
    if (resp.ok) location.href = '/signin'
}