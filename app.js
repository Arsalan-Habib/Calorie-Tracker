// Storage Controller

//Item Controller
const ItemCtrl = (function () {
    //Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    //Data Structure/  State
    const data = {
        items: [
            // { id: 4, name: "steak", calories: 1200 },
            // { id: 6, name: "cookie", calories: 400 },
            // { id: 8, name: "eggs", calories: 300 },
        ],
        currentItem: null,
        totalCalories: 0,
    };
    //Public Methods
    return {
        getItems: function () {
            return data.items;
        },

        logData: function () {
            return data;
        },

        addItem: function (name, calories) {
            //Create ID
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Calories to integer
            calories = parseInt(calories);

            //Create new item
            newItem = new Item(ID, name, calories);

            //Add to items array
            data.items.push(newItem);

            return newItem;
        },
    };
})();

//UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
    };

    //Public Methods
    return {
        populateItemsList: function (items) {
            let html = "";
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"
                    ><i class="edit-item fa fa-pencil"></i
                ></a>
            </li>`;
            });

            //Insert List Items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput)
                    .value,
            };
        },

        addListItem: function (item) {
            //Show/unhide list
            document.querySelector(UISelectors.itemList).style.display =
                "block";

            //create li list element
            const li = document.createElement("li");
            //Add Class
            li.className = "collection-item";
            //ADD ID
            li.id = `item-${item.id}`;

            //Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"
                ><i class="edit-item fa fa-pencil"></i
            ></a>`;
            //Insert item
            document
                .querySelector(UISelectors.itemList)
                .insertAdjacentElement("beforeend", li);
        },

        clearFields: function () {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },

        getSelectors: function () {
            return UISelectors;
        },

        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
    };
})();

//App Controller
const App = (function (ItemCtrl, UICtrl) {
    //Event Load listeners
    const loadEventListeners = function () {
        //get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document
            .querySelector(UISelectors.addBtn)
            .addEventListener("click", itemAddSubmit);
    };

    //Add item submit
    const itemAddSubmit = function (e) {
        //Get form input from UI Controller
        const input = UICtrl.getItemInput();

        //Check for name and clorie input
        if (input.name !== "" && input.calories !== "") {
            //Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add item to UI list
            UICtrl.addListItem(newItem);

            //Clear fields
            UICtrl.clearFields();
        }

        e.preventDefault();
    };

    //Public methods
    return {
        init: function () {
            //Fetch Items from data structure
            const items = ItemCtrl.getItems();

            //Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                //Populate list with items
                UICtrl.populateItemsList(items);
            }

            //Load event listeners
            loadEventListeners();
        },
    };
})(ItemCtrl, UICtrl);

App.init();
