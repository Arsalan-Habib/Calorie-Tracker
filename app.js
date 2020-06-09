// Storage Controller
const StorageCtrl = (function () {
    //Public Methods
    return {
        storeItem: function (item) {
            let items;
            // Check if any item in LS
            if (localStorage.getItem("items") === null) {
                items = [];

                //push new item
                items.push(item);

                //Set LS
                localStorage.setItem("items", JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem("items"));

                //push new item
                items.push(item);

                //Set LS
                localStorage.setItem("items", JSON.stringify(items));
            }
        },

        getItemsFromStorage: function () {
            let items;

            if (localStorage.getItem("items") === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem("items"));
            }

            return items;
        },

        updateItemStorage: function (updatedItem) {
            //get items
            let items = JSON.parse(localStorage.getItem("items"));

            items.forEach(function (item, index) {
                //Take out the old item and replace it with the updated one
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });

            //Set LS with updated items
            localStorage.setItem("items", JSON.stringify(items));
        },

        deleteItemFromStorage: function (id) {
            //get items
            let items = JSON.parse(localStorage.getItem("items"));

            items.forEach(function (item, index) {
                //Take out the old item and replace it with the updated one
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });

            //Set LS with updated items
            localStorage.setItem("items", JSON.stringify(items));
        },

        clearItemsFromStorage: function () {
            let items;

            if (localStorage.getItem("items") === null) {
                items = [];
                localStorage.setItem("items", JSON.stringify(items));
            } else {
                localStorage.removeItem("items");
            }
        },
    };
})();

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
        items: StorageCtrl.getItemsFromStorage(),
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

        deleteItem: function (id) {
            //Get Ids
            ids = data.items.map(function (item) {
                return item.id;
            });

            //Get index
            const index = ids.indexOf(id);

            //Remove item
            data.items.splice(index, 1);
        },

        ClearAllItems: function () {
            data.items = [];
        },

        updateItem: function (name, calories) {
            //Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
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
        clearBtn: ".clear-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories",
        listItems: "#item-list li",
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
        updateListItem: function (updatedItem) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn nodelist into array
            listItems = Array.from(listItems);

            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute("id");

                if (itemID === `item-${updatedItem.id}`) {
                    document.querySelector(
                        `#${itemID}`
                    ).innerHTML = `<strong>${updatedItem.name}: </strong> <em>${updatedItem.calories} Calories</em>
                    <a href="#" class="secondary-content"
                        ><i class="edit-item fa fa-pencil"></i
                    ></a>`;
                }
            });
        },

        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn Nodelist into array
            listItems = Array.from(listItems);

            listItems.forEach(function (item) {
                item.remove();
            });
        },

        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
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
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    //Event Load listeners
    const loadEventListeners = function () {
        //get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document
            .querySelector(UISelectors.addBtn)
            .addEventListener("click", itemAddSubmit);

        //Disable submit on Enter
        document.addEventListener("keypress", function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        //Edit icon click event
        document
            .querySelector(UISelectors.itemList)
            .addEventListener("click", itemEditClick);

        //Update item event
        document
            .querySelector(UISelectors.updateBtn)
            .addEventListener("click", itemUpdateSubmit);

        //Delete button event
        document
            .querySelector(UISelectors.deleteBtn)
            .addEventListener("click", itemDeleteSubmit);

        //Clear items event
        document
            .querySelector(UISelectors.clearBtn)
            .addEventListener("click", ClearAllItemsClick);

        //Back button event
        document
            .querySelector(UISelectors.backBtn)
            .addEventListener("click", (e) => {
                UICtrl.clearEditState();
                e.preventDefault();
            });
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

            //Store in LS
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearFields();
        }

        e.preventDefault();
    };

    //Item edit click
    const itemEditClick = function (e) {
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

    const itemUpdateSubmit = function (e) {
        //Get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Update Local Storage
        StorageCtrl.updateItemStorage(updatedItem);

        //Clear Edit State
        UICtrl.clearEditState();

        e.preventDefault();
    };

    const itemDeleteSubmit = function (e) {
        // Get current Item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Remove from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        //Clear Edit State
        UICtrl.clearEditState();

        e.preventDefault();
    };

    //Clear Items Event
    const ClearAllItemsClick = function () {
        //Delete all items from data structure
        ItemCtrl.ClearAllItems();

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Remove from UI
        UICtrl.removeItems();

        //Clear From LS
        StorageCtrl.clearItemsFromStorage();

        //Hide Ul
        UICtrl.hideList();
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
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
