const fetchAllItems = async () => {
    let page = 0;
    let allItems = [];
    let moreItemsAvailable = true;

    while (moreItemsAvailable) {
        const response = await fetch(`https://eldenring.fanapis.com/api/weapons?page=${page}`);
        const data = await response.json();
        const weaponList = data['data'];
        allItems = allItems.concat(weaponList);

        moreItemsAvailable = weaponList.length === 20;
        page++;
    }

    document.getElementById('searchForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('Name').value.toLowerCase();
        const description = document.getElementById('Description').value.toLowerCase();
        const results = allItems.filter(user => { return (name ? user.name.toLowerCase().includes(name) : true) && (description ? user.description.toLowerCase().includes(description) : true) });
        if (Object.keys(results).length != 0) {
            const resultsContainer = document.getElementById('Results');
            resultsContainer.innerHTML = '';
            const myTable = document.getElementById("tableID");
            document.body.removeChild(myTable);
            const table = generateTable(results);
            table.setAttribute("class", "tableSection");
            document.body.appendChild(table);
        }
    })

    console.log(allItems);

    function generateTable(data) {
        const table = document.createElement("table");
        table.id = "tableID"
        const headers = Object.keys(data[0]);
        const headerRow = table.insertRow();
        headers.forEach(header => {
            if (header === 'id') return;
            th = document.createElement("th");
            header = header.replace(/([A-Z])/g, ' $1').trim();
            th.textContent = header;
            headerRow.appendChild(th);
        })
        data.forEach(item => {
            const bodyRow = table.insertRow();
            headers.forEach(header => {
                if (header === 'id') return;
                const cell = bodyRow.insertCell();
                const value = item[header];
                if (header === 'image') {
                    const img = document.createElement('img');
                    img.src = value;
                    cell.appendChild(img);
                }
                //Removing here?
                else if (Array.isArray(value)) {
                    cell.textContent = value.map(obj => {
                        if (typeof obj === 'object') {
                            //console.log("Found Object");
                            let objectValues = Object.values(obj).join(' ');
                            //console.log("Found Object");
                            if (obj.hasOwnProperty('name')) {
                                if (obj.name === 'Phy') {
                                    console.log("Found Object");
                                    //const newTd = document.createElement("td");
                                    const img = document.createElement('img');
                                    img.src = "physical-damage.png";
                                    cell.appendChild(img);
                                    console.log(cell)
                                }
                            }
                            return objectValues;
                        }
                        return obj;
                    })
                        .join(',  ');
                }
                else {
                    cell.textContent = value;
                }
            })
        })
        return table;
    }

    function renderTable() {
        const table = generateTable(allItems);
        table.setAttribute("class", "tableSection");
        document.body.appendChild(table);
    }
    renderTable();

    function insertImageAfterText(tableId, searchText, imageSrc, imageAlt) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const cells = table.getElementsByTagName('td');

        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];

            // Skip if image already inserted
            if ([...cell.querySelectorAll('img')].some(img => img.src.includes(imageSrc))) {
                continue;
            }

            for (let j = 0; j < cell.childNodes.length; j++) {
                const node = cell.childNodes[j];

                // Only operate on text nodes
                if (node.nodeType === Node.TEXT_NODE && node.textContent.includes(searchText)) {
                    const fullText = node.textContent;
                    const index = fullText.indexOf(searchText);
                    const before = fullText.substring(0, index + searchText.length);
                    const after = fullText.substring(index + searchText.length);

                    // Create new nodes
                    const beforeNode = document.createTextNode(before);
                    const img = document.createElement('img');
                    img.src = imageSrc;
                    img.alt = imageAlt;
                    img.className = 'damageIcon';
                    img.style.marginLeft = '4px';
                    const afterNode = document.createTextNode(after);

                    // Replace the original text node with the three new nodes
                    cell.replaceChild(afterNode, node);
                    cell.insertBefore(img, afterNode);
                    cell.insertBefore(beforeNode, img);
                }
            }
        }
    }

    // Adding loop here:
    insertImageAfterText('tableID', 'Phy', 'images/physical-damage.png', 'Physical Damage Icon');
    insertImageAfterText('tableID', 'Mag', 'images/magic-damage.png', 'Magic Damage Icon');
    insertImageAfterText('tableID', 'Fire', 'images/fire-damage.png', 'Fire Damage Icon');
    insertImageAfterText('tableID', 'Ligt', 'images/lightning-damage.png', 'Lightning Damage Icon');
    insertImageAfterText('tableID', 'Holy', 'images/holy-damage.png', 'Holy Damage Icon');
}
fetchAllItems().catch(error => console.error('Error fetching data:', error));

document.addEventListener("DOMContentLoaded", renderTable);