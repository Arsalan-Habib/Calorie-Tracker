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

        getItemById: function (id) {
            let found = null;

            //loop through items
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },

        setCurrentItem: function (item) {
            data.currentItem = item;
        },

        getCurrentItem: function () {
            return data.currentItem;
        },

        getTotalCalories: function () {
            let total = 0;

            //loop through items and add cals
            data.items.forEach(function (item) {
                total += item.calories;
            });

            //set total calories in data
            data.totalCalories = total;

            return data.totalCalories;
        },
    };
})();

//UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories",
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

        showTotalCalories: function (totalCalories) {
            document.querySelector(
                UISelectors.totalCalories
            ).textContent = totalCalories;
        },

        clearFields: function () {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },

        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display =
                "inline";
            document.querySelector(UISelectors.deleteBtn).style.display =
                "inline";
            document.querySelector(UISelectors.backBtn).style.display =
                "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";
        },

        addItemToForm: function () {
            document.querySelector(
                UISelectors.itemNameInput
            ).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(
                UISelectors.itemCaloriesInput
            ).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        getSelectors: function () {
            return UISelectors;
        },

        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },

        clearEditState: function () {
            UICtrl.clearFields();
            document.querySelector(UISelectors.updateBtn).style.display =
                "none";
            document.querySelector(UISelectors.deleteBtn).style.display =
                "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";
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

        //Edit icon click event
        document
            .querySelector(UISelectors.itemList)
            .addEventListener("click", itemUpdateSubmit);
    };

    //Add item submit
    const itemAddSubmit = function (e) {
        //Get form input from UI Controller
        const input = UICtrl.getItemInput();

        //Check for name and calorie input
        if (input.name !== "" && input.calories !== "") {
            //Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add item to UI list
            UICtrl.addListItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Clear fields
            UICtrl.clearFields();
        }

        e.preventDefault();
    };

    //Update Item submit
    const itemUpdateSubmit = function (e) {
        if (e.target.classList.contains("edit-item")) {
            // Get list item id(item-0,item-1,item-...)

            const listId = e.target.parentNode.parentNode.id;

            //Break into an array
            const listIdArr = listId.split("-");

            //Get the actual id
            const id = parseInt(listIdArr[1]);

            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //set current Item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    };

    //Public methods
    return {
        init: function () {
            //Clear edit state/ set initial state
            UICtrl.clearEditState();

            //Fetch Items from data structure
            const items = ItemCtrl.getItems();

            //Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                //Populate list with items
                UICtrl.populateItemsList(items);
            }

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();
        },
    };
})(ItemCtrl, UICtrl);

App.init();
