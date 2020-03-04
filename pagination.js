
function Paginationr(config) 
{

    if (typeof config.disable == "undefined") {
        config.disable = false;
    }

    
    var pagebutton;
    if (!(config.pagebutton instanceof Element)) {
        config.pagebutton = document.createElement("div");
    }
    pagebutton = config.pagebutton;

    // get/make function for getting table's rows
    if (typeof config.get_rows != "function") {
        config.get_rows = function () {
            var table = config.table
            var tbody = table.getElementsByTagName("tbody")[0]||table;

            // get all the possible rows for paging
            // exclude any rows that are just headers or empty
            children = tbody.children;
            var trs = [];
            for (var i=0;i<children.length;i++) {
                if (children[i].nodeType = "tr") {
                    if (children[i].getElementsByTagName("td").length > 0) {
                        trs.push(children[i]);
                    }
                }
            }

            return trs;
        }
    }
    var get_rows = config.get_rows;
    var trs = get_rows();

    // get/set rows per page
    if (typeof config.rows_per_page == "undefined") {
        var selects = pagebutton.getElementsByTagName("select");
        if (typeof selects != "undefined" && (selects.length > 0 && typeof selects[0].selectedIndex != "undefined")) {
            config.rows_per_page = selects[0].options[selects[0].selectedIndex].value;
        } else {
            config.rows_per_page = 10;
        }
    }
    var rows_per_page = config.rows_per_page;

    // get/set current page
    if (typeof config.page == "undefined") {
        config.page = 1;
    }
    var page = config.page;

    // get page count
    var pages = (rows_per_page > 0)? Math.ceil(trs.length / rows_per_page):1;

    // check that page and page count are sensible values
    if (pages < 1) {
        pages = 1;
    }
    if (page > pages) {
        page = pages;
    }
    if (page < 1) {
        page = 1;
    }
    config.page = page;
 
    // hide rows not on current page and show the rows that are
    for (var i=0;i<trs.length;i++) {
        if (typeof trs[i]["data-display"] == "undefined") {
            trs[i]["data-display"] = trs[i].style.display||"";
        }
        if (rows_per_page > 0) {
            if (i < page*rows_per_page && i >= (page-1)*rows_per_page) {
                trs[i].style.display = trs[i]["data-display"];
            } else {
                // Only hide if pagination is not disabled
                if (!config.disable) {
                    trs[i].style.display = "none";
                } else {
                    trs[i].style.display = trs[i]["data-display"];
                }
            }
        } else {
            trs[i].style.display = trs[i]["data-display"];
        }
    }

    // page button maker functions
    config.active_class = config.active_class||"active";
    if (typeof config.page_mode != "function" && config.page_mode != "list" && config.page_mode != "buttons") {
        config.page_mode = "button";
    }
    if (typeof config.page_mode == "function") {
        config.page_mode(config);
    } else {
        var make_button;
        if (config.page_mode == "list") 
        {
            make_button = function (symbol, index, config, disabled, active) 
            {
                var li = document.createElement("li");
                var a  = document.createElement("a");
                a.href = "#";
                a.innerHTML = symbol;
                a.addEventListener("click", function (event) {
                    event.preventDefault();
                    this.parentNode.click();
                    return false;
                }, false);
                li.appendChild(a);

                var classes = [];
                if (disabled) {
                    classes.push("disabled");
                }
                if (active) {
                    classes.push(config.active_class);
                }
                li.className = classes.join(" ");
                li.addEventListener("click", function () {
                    if (this.className.split(" ").indexOf("disabled") == -1) {
                        config.page = index;
                        Paginationr(config);
                    }
                }, false);
                return li;
            }
        } 
        else 
        {
            make_button = function (symbol, index, config, disabled, active) 
            {
                var button = document.createElement("button");
                button.innerHTML = symbol;
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    if (this.disabled != true) {
                        config.page = index;
                        Paginationr(config);
                    }
                    return false;
                }, false);
                if (disabled) {
                    button.disabled = true;
                }
                if (active) {
                    button.className = config.active_class;
                }
                return button;
            }
        }

        // make page button collection
        var page_box = document.createElement(config.page_mode == "list"?"ul":"div");
        if (config.page_mode == "list") {
            page_box.className = "pagination";
        }

        var left = make_button("&laquo;", (page>1?page-1:1), config, (page == 1), false);
        page_box.appendChild(left);

        for (var i=1;i<=pages;i++) 
        {
            var iplus  = 4 + parseInt(page);   /// Last Page Button after page 1
            var iplus2 = 2 + parseInt(page);   /// Last Page Button after active page
            var iplus3 = 3 + parseInt(page);   /// Last Page Button after active page
            var imin   = parseInt(page) - 3;   /// First Page before active page
            var li = make_button(i, i, config, false, (page == i));
            if (page <= 5) 
            {
                if (page == 1) {
                    if (i <= iplus)
                    {
                        if (i > imin) 
                        {
                            page_box.appendChild(li);
                        }
                    }
                }else if (page == 2) {
                    if (i <= iplus3)
                    {
                        if (i > imin) 
                        {
                            page_box.appendChild(li);
                        }
                    }
                }else if (page == 3) {
                    if (i <= iplus2)
                    {
                        if (i > imin) 
                        {
                            page_box.appendChild(li);
                        }
                    }
                }else{
                    if (i <= iplus2)
                    {
                        if (i > imin) 
                        {
                            page_box.appendChild(li);
                        }
                    }
                }
            }else{
              if (i <= iplus2)
              {
                  if (i > imin) 
                  {
                      page_box.appendChild(li);
                  }
              }
            }

        }
        //// End Page Button
        
        var right = make_button("&raquo;", (pages>page?page+1:page), config, (page == pages), false);
        page_box.appendChild(right);
        if (pagebutton.childNodes.length) {
            while (pagebutton.childNodes.length > 1) {
                pagebutton.removeChild(box.childNodes[0]);
            }
            pagebutton.replaceChild(page_box, pagebutton.childNodes[0]);
        } else {
            pagebutton.appendChild(page_box);
        }
    }

    // make rows per page selector
    if (!(typeof config.page_options == "boolean" && !config.page_options)) {
        if (typeof config.page_options == "undefined") {
            config.page_options = [
                { value: 10, text: '10 Record'  },
                { value: 20, text: '20 Record'  },
                { value: 50, text: '50 Record'  },
                { value: 100,text: '100 Record' },
                { value: 0,  text: 'All Record' }
            ];
        }
        var options = config.page_options;
        var select = document.createElement("select");
        for (var i=0;i<options.length;i++) {
            var o = document.createElement("option");
            o.value = options[i].value;
            o.text = options[i].text;
            select.appendChild(o);
        }
        select.value = rows_per_page;
        select.addEventListener("change", function () {
            config.rows_per_page = this.value;
            Paginationr(config);
        }, false);
        pagebutton.appendChild(select);
    }

    // status message
    var stat = document.createElement("span");
    stat.innerHTML = "Page " + page + " of " + pages
        + ", Showing rows " + (((page-1)*rows_per_page)+1)
        + " to " + (trs.length<page*rows_per_page||rows_per_page==0?trs.length:page*rows_per_page)
        + " of " + trs.length;
    pagebutton.appendChild(stat);

    // hide pagination if disabled
    if (config.disable) {
        if (typeof pagebutton["data-display"] == "undefined") {
            pagebutton["data-display"] = pagebutton.style.display||"";
        }
        pagebutton.style.display = "none";
    } else {
        if (pagebutton.style.display == "none") {
            pagebutton.style.display = box["data-display"]||"";
        }
    }

    // run tail function
    if (typeof config.tail_call == "function") {
        config.tail_call(config);
    }

    return pagebutton;
}

// ===========================================//
// Call This Function To Run Function Above ==//
// ===========================================//
function PageTable(){
  var box = bigpaginator({
        table: document.getElementById("table_pagination").getElementsByTagName("table")[0],
        box_mode: "list",
    });
    box.className = "pagebutton";
    document.getElementById("table_pagination").appendChild(pagebutton);
}

// =============================================================//
// If pagination showing more than 1, add this function below ==//
// =============================================================//
function ActivePagination()
{
  var pjgpage = []
  var box   = document.getElementsByClassName("box");
  var boxlength = box.length - 1;
  var boxlength2 = box.length - 2;
  for (var i = 0; i <= box.length; i++) 
  {
    if (i == boxlength2)
    {
      document.getElementsByClassName("box")[i].style.display = "none"
    }
  }
}