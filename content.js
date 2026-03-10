/*
* i
*/
let currentTittleSize = 1.0; 

const menuObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((addedElement) => {
            if (addedElement.nodeType === Node.ELEMENT_NODE 
                && addedElement.classList.contains('goog-menu')) {

                if (addedElement.textContent.includes('Size') 
                    && addedElement.textContent.includes('Capitalization')) {
                    injectTittleOption(addedElement); 
                }
            }
        });
    });
});

menuObserver.observe(document.body, { childList: true, subtree: true });

function injectTittleOption(dropdownOptions) {
    if (dropdownOptions.querySelector('.tittle-option')) {
        return;
    }
    
    const sizeOption = Array.from(dropdownOptions.querySelectorAll('.goog-menuitem'))
                        .find(row => row.textContent.trim().startsWith('Size'));
                        
    if (sizeOption) {
        const newItem = document.createElement('div');

        newItem.className = 'goog-menuitem tittle-option';
        newItem.innerHTML = `
            <div class="goog-menuitem-content" style="display:flex; justify-content:space-between; width:100%;">
                <span class="goog-menuitem-label">Tittle size</span>
                <span style="color:#5f6368; font-size:10px;">▶</span>
            </div>`;        
            
        newItem.onmouseenter = (e) => sliderSubmenu(e.target);

        sizeOption.parentNode.insertBefore(newItem, sizeOption.nextSibling);
    }
}

function sliderSubmenu(hoverMenu) {
    let sliderMenu = document.querySelector('.tittle-submenu-box');
    
    if (!sliderMenu) {
        sliderMenu = document.createElement('div');
        sliderMenu.classList.add('tittle-submenu-box');
        sliderMenu.innerHTML = `
            <div class="slider-text">
                <span>Size</span>
                <span id="tittle-value-text">1.0x</span>
            </div>
            <input type="range" id="tittle-range" class="slider-bar" min="1" max="30" step="0.5" value="1">`;        
            
        document.body.appendChild(sliderMenu);
        
        const slider = sliderMenu.querySelector('#tittle-range');
        
        slider.oninput = (e) => {
            currentTittleSize = parseFloat(e.target.value);

            document.documentElement.style.setProperty('--tittle-size', currentTittleSize);
            document.getElementById('tittle-value-text').textContent = currentTittleSize + 'x';
        };

        slider.addEventListener('change', () => {
             if (document.getElementById('faux-doc')) {
                 document.getElementById('faux-doc').focus();
             }
        });

        sliderMenu.onmouseleave = () => {
            sliderMenu.style.display = 'none';
        };
    }

    const itemPosition = hoverMenu.getBoundingClientRect();
    sliderMenu.style.cssText = `display:block; top:${itemPosition.top}px; left:${itemPosition.right + 2}px;`;
}

function fauxDocument() {
    if (document.getElementById('fake-layer')) {
        return;
    }

    let fakeLayer = document.createElement('div');
    fakeLayer.id = 'fake-layer';

    let editor = document.querySelector('.kix-appview-editor');

    if (!editor) {
        editor = document.body;
    }
        
    let doc = document.createElement('div');
    doc.id = 'faux-doc';

    doc.contentEditable = true;

    doc.innerHTML = "<div><br></div>";
    fakeLayer.appendChild(doc);
    editor.appendChild(fakeLayer); 
    doc.focus();

    doc.addEventListener('beforeinput', (e) => {
        if (e.data === 'i' || e.data === 'j') {
            e.preventDefault();
            
            let baseOfLetter;
            if (e.data === 'i') {
                baseOfLetter = '&#305;'; // Dotless 'ı'
            } 
            else {
                baseOfLetter = '&#567;'; // Dotless 'ȷ'
            }
            
            let customTittledLetter = `<span class="tittle-container"><span class="base-of-letter">${baseOfLetter}</span><span class="tittle"></span></span>&#8203;`;
            
            document.execCommand('insertHTML', false, customTittledLetter);
        }
    });
}


let layerThere = document.getElementById('fake-layer');
if (layerThere) {
    layerThere.remove();
}

fauxDocument();