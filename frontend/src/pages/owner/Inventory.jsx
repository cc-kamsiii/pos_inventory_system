 import "../../Style/Inventory.css"

function Inventory () {
  return (
    <div className="inventory">
        <div className="inventory-container">
          <div className="title-search-create">
            <div>
              <h2>Inventory Management</h2>
            </div>
              <form>
                <input type="text" placeholder="Search inventory"/>
              </form>
              <div>
                <button>Add Inventory</button>
              </div>
          </div>
        </div>
    </div>
  );

};

export default Inventory;
