var app_menu = [
    {
        label : 'Settings',
        submenu: [
            {
                label : 'Notify',
                type : 'checkbox',
                click : (menuItem)=>{
                    changeVar(menuItem);
                }
            },
            {
                label : 'Edit shortcuts',
                click : ()=>{
                    editShorts();
                }
            },
            {
                label : 'Zoom',
                role : 'zoom'
            }
        ]
    }
];

var callBack;

function init(callBa){
    callBack=callBa;
}

function changeVar(menuItem){
    callBack.changeNotify(menuItem.enabled);
}

function editShorts(){
    callBack.changeShortcuts();
}

