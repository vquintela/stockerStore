// Card creacion producto
document.getElementById("imagen").onchange = (e) => {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
        let preview = document.getElementById('preview'),
            image = document.createElement('img');
        image.src = reader.result;
        image.setAttribute('class', 'img-fluid')
        preview.innerHTML = '';
        preview.append(image);
    };
}

document.getElementById('nombre').onchange = e => {
    document.getElementById('title-card').innerText = e.target.value;
}

document.getElementById('precio').onchange = e => {
    document.getElementById('precio-card').innerText = e.target.value;
}

document.getElementById('marca').onchange = e => {
    const combo = document.getElementById("marca");
    const selected = combo.options[combo.selectedIndex].text;
    document.getElementById('marca-card').innerText = selected;
}

document.getElementById('modelo').onchange = e => {
    document.getElementById('modelo-card').innerText = e.target.value;
}