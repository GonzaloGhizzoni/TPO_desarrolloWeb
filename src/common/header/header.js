/// Function that loads header dynamically.
/// Param: actualView -> the actual view where the header needs to be loaded. 
/// We use export to use this function in other JavaScript modules.
export function loadHeader(actualView) {
    fetch('../../common/header/header.html')
        .then(response => response.text())
        .then(data => {            
            document.querySelector('header').innerHTML = data;
            const navItems = document.querySelectorAll('.navbar-nav li');
            selectActualView (actualView,navItems);
        });
}

/// Function that selects the actual view in the header navigation.
/// Param: actualView -> the actual view where the header needs to be loaded. 
/// Param: navItems -> List of nav-items to iterate.
function selectActualView (actualView,navItems) {
    navItems.forEach(item => {
        // Get the link inside <li> element.
        var link = item.querySelector('a');
        // Compare the URL link with actualView parameter.
        if (link.getAttribute('href') === actualView) {
            // If it matches, add 'active' class to <li> element.
            item.classList.add('active');
        } else {
            // If it doesn't match, ensure to remove 'active' class from <li> element.
            item.classList.remove('active');
        }
    });
}



