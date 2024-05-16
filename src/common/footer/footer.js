/// Function that loads footer dynamically.
/// We use export to use this function in other JavaScript modules.
export function loadFooter() {
    fetch('../../common/footer/footer.html')
        .then(response => response.text())
        .then(data => { 
            document.querySelector('footer').innerHTML = data;
        });
}