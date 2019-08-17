var getSelectedTab = tab => {
    var tabId = tab.id;
    var sendMessage = messageObj => chrome.tabs.sendMessage(tabId, messageObj);
    chrome.storage.local.get('icons', item => {
        Object.keys(item.icons).forEach(key => {
            document.getElementById(key).checked = item.icons[key].checked;
            document.getElementById(key).addEventListener('click', event =>
                sendMessage({
                    name: 'selectIcon',
                    mode: key,
                    checked: event.target.checked
                })
            );
        });
    });
    let sortArray = ['price', 'cup', 'age', 'rank'];
    chrome.storage.local.get('sort', item => {
        document.getElementById('sort_type').options[sortArray.indexOf(item.sort.type)].selected = 'selected';
        document.getElementById('sort_type').addEventListener('change', event =>
            sendMessage({
                name: 'sorting',
                type: event.target.value,
                dir: document.getElementById('sort_dir').checked
            })
        );
        document.getElementById('sort_dir').checked = item.sort.dir;
        document.getElementById('sort_dir').addEventListener('click', event =>
            sendMessage({
                name: 'sorting',
                type: document.getElementById('sort_type').options[
                    document.getElementById('sort_type').options.selectedIndex
                ].value,
                dir: event.target.checked
            })
        );
    });
    chrome.storage.local.get('filter', item => {
        Object.keys(item.filter).forEach(key => {
            document.getElementById(key).checked = item.filter[key].checked;
            document.getElementById(key).addEventListener('click', event =>
                sendMessage({
                    name: 'filter',
                    mode: key,
                    checked: event.target.checked
                })
            );
        });
    });
};
chrome.tabs.getSelected(null, getSelectedTab);
