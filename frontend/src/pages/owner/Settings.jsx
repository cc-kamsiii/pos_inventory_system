import "../../Style/Settings.css"

function Settings (){
    return(
        <div className="settings-container">
            <div className="settings">
                <h2>Settings</h2>
            </div>
            <div className="settings-option">
                <button>Create Account</button>
                <button>Delete Account</button>
            </div>
        </div>
    );
}

export default Settings;