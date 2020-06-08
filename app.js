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
            { id: 0, name: "steak", calories: 1200 },
            { id: 0, name: "cookie", calories: 400 },
            { id: 0, name: "eggs", calories: 300 },
        ],
        currentItem: null,
        totalCalories: 0,
    };
    //Public Methods
    return {
        logData: function () {
            return data;
        },
    };
})();

//UI Controller
const UICtrl = (function () {
    //Public Methods
    return {};
})();

//App Controller
const App = (function (ItemCtrl, UICtrl) {
    //Public methods
    return {
        init: function () {
            console.log("initializing app..");
        },
    };
})(ItemCtrl, UICtrl);

App.init();
