let back = chrome.extension.getBackgroundPage();
let textManager = back.getTextManager();
let cat_list = textManager.getTextList();

let ui = {
    cat_item: $('<button class="cat_item"><div class="cat_item_text"></div><div class="cat_item_delete"><img src="../images/close.svg"></div></button>')
};

function init() {
    handleInfoText();
    let cat_list_div = $("#cat_list");
    util.each(cat_list, function (item) {
        let cat_item = ui.cat_item.clone();
        let del_button = cat_item.find(".cat_item_delete");
        let text = "";
        if (item.text.length > 200) {
            text = item.text.substring(0, 200) + " ...";
        } else {
            text = item.text;
        }
        text = util.escapeHTML(text);
        cat_item.attr("id", "itemid_" + item.id);
        del_button.attr("id", "deleteid_" + item.id);
        cat_item.find(".cat_item_text").html(text);
        cat_list_div.append(cat_item);
    });
    $(".cat_item_delete").click(function () {
        try {
            let id = $(this).attr("id");
            id = id && id.split("_")[1];
            id = parseInt(id, 10);
            let success = textManager.deleteEntryById(id);
            if (success) {
                let item_id = "itemid_" + id;
                $("#" + item_id).remove();
            }
        } catch (e) {
        }
        handleInfoText();
    });
    let clipboardObj = new ClipboardJS('.cat_item', {
        text: function(trigger) {
            try {
                let id = $(trigger).attr("id");
                id = id && id.split("_")[1];
                id = parseInt(id, 10);
                return textManager.getTextById(id);
            } catch (e) {
                return "";
            }
        }
    });
}

function handleInfoText() {
    let list = textManager.getTextList();
    if (list.length) {
        $("#info").hide();
    } else {
        $("#info").show();
    }
}

$(document).ready(function () {
    init();
});
