let textManager = function () {
    let last_index = 0;
    let max_length = 40;
    let textList = [];

    function getTextList() {
        let list = [];
        for (let i = textList.length - 1; i >= 0; i--) {
            list.push(textList[i]);
        }
        return list;
    }

    function getTextById(id) {
        return util.any(textList, function (item) {
            if (item.id === id) return item.text;
        });
    }

    function deleteEntryById(id) {
        let status = util.any(textList, function (item, index) {
            if (item.id === id) {
                textList.splice(index, 1);
                return true;
            }
        }) || false;
        updateStorage();
        return status;
    }

    function addNewEntry(text) {
        last_index++;
        if (textList.length >= max_length) {
            textList.splice(0, 1);
        }
        textList.push({
            id: last_index,
            text: text
        });
        updateStorage();
    }

    function updateStorage() {
        try {
            chrome.storage.sync.set({catList: textList}, function () {

            });
        } catch (e) {
        }
    }

    function fetchFromStorage() {
        chrome.storage.sync.get('catList', function (obj) {
            let catList = obj && obj.catList;
            if (catList && catList.length > 0) {
                textList = [];
                util.each(catList, function (item) {
                    if (item && item.text && util.isString(item.text)) {
                        textList.push({
                            id: textList.length + 1,
                            text: item.text
                        });
                    }
                });
                last_index = textList.length;
            }
        });
    }

    return {
        getTextList: getTextList,
        getTextById: getTextById,
        deleteEntryById: deleteEntryById,
        addNewEntry: addNewEntry,
        fetchFromStorage: fetchFromStorage
    }
}();

function getTextManager() {
    return textManager;
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.id === "copyText") {
            if (request.copyText) {
                let text = request.copyText;
                textManager.addNewEntry(text);
            }
        }
    });

textManager.fetchFromStorage();
