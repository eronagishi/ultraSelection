let girlList = $.each($('ul.gals-list.clearfix li'), function() {});
let girlListClearfix = $('ul.gals-list.clearfix');
if (girlList.length === 0) {
    girlList = $.each($('ul.gals-list2.clearfix li'), function() {});
    girlListClearfix = $('ul.gals-list2.clearfix');
}

function selectType(message) {
    if (message.name === 'selectIcon') {
        let icons = {};
        chrome.storage.local.get('icons', item => {
            icons = item.icons;
            icons[message.mode].checked = message.checked;
            $.each(girlList, function(_, val) {
                let typeArray = Object.keys(icons).map(key => ({
                    name: key,
                    img: icons[key].img,
                    checked: icons[key].checked
                }));
                let girlName = $(val).find('p.gals-name')[0].innerText;
                let iconList = $(val)
                    .find('div.g-playicon img')
                    .map(function(_, imgVal) {
                        return $(imgVal)[0].src;
                    })
                    .toArray();
                let show = typeArray
                    .filter(type => type.checked)
                    .every(type => iconList.some(icon => icon === `${window.location.origin}/images/icon/${type.img}`));
                show ? $(val).show() : $(val).hide();
            });
            chrome.storage.local.set({
                icons: icons
            });
        });
    }
}

function sortByPrice(message) {
    if (message.name === 'sorting') {
        $.each(girlList, function(_, val) {
            let value = '';
            switch (message.type) {
                case 'price':
                    value = $(val)
                        .find('div.pm-price')[0]
                        .innerText.replace(new RegExp(/[^\d]/, 'gi'), match => '');
                    break;
                case 'age':
                    value = $(val)
                        .find('p.gals-name')[0]
                        .innerText.replace(new RegExp(/[^\d]/, 'gi'), match => '');
                    break;
                case 'cup':
                    let size = $(val).find('span.gals-size')[0].innerText;
                    value = size.split('(')[1].split(')')[0];
                    break;
            }
            $(this).attr(message.type, value);
        });
        girlListClearfix.html(
            girlListClearfix.children('li').sort(function(a, b) {
                let A = a.getAttribute(message.type),
                    B = b.getAttribute(message.type);
                if (A !== '' && Number(A)) {
                    return (message.dir ? -1 : 1) * (A - B);
                } else {
                    return message.dir ? A.localeCompare(B) : B.localeCompare(A);
                }
            })
        );
        chrome.storage.local.set({
            sort: { type: message.type, dir: message.dir }
        });
    }
}

function filter(message) {
    if (message.name === 'filter') {
        let filter = {};
        chrome.storage.local.get('filter', item => {
            filter = item.filter;
            filter[message.mode].checked = message.checked;
            $.each(girlList, function(_, val) {
                let filterArray = Object.keys(filter).map(key => ({
                    name: key,
                    checked: filter[key].checked
                }));
                let filterObj = {};
                let rank = $(val).find('div.f-icon div.f-list img'),
                    avIcon = $(val).find('div.av-icon div.av-iconbox img');
                if (rank.length > 0) {
                    filterObj.Rank = rank[0].src;
                }
                if (avIcon.length > 0) {
                    filterObj.AV = avIcon[0].src;
                }
                let show = filterArray.filter(el => el.checked).every(type => filterObj[type.name]);
                show ? $(val).show() : $(val).hide();
            });
            chrome.storage.local.set({
                filter: filter
            });
        });
    }
}

chrome.storage.local.set({
    icons: {
        GF: {
            img: 'g-icon_gf.png',
            checked: false
        },
        TWEET: {
            img: 'g-icon_twitter.png',
            checked: false
        },
        VR: {
            img: 'g-icon_vr.png',
            checked: false
        },
        VIDEO: {
            img: 'g-icon_movie.png',
            checked: false
        },
        LETTER: {
            img: 'g-icon_fl.png',
            checked: false
        }
    },
    sort: {
        type: 'price',
        dir: true
    },
    filter: {
        AV: { checked: false },
        Rank: { checked: false }
    }
});
chrome.runtime.onMessage.addListener(selectType);
chrome.runtime.onMessage.addListener(sortByPrice);
chrome.runtime.onMessage.addListener(filter);
