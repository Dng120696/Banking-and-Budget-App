import { Link } from "react-router-dom";

function ListItem({ state, dispatch }) {
  return (
    <div className="list__item">
      {state.accountList.length === 0 ? (
        <p>Account List Empty</p>
      ) : (
        state.accountList.map((acc) => (
          <ul key={acc.id} className="list">
            <li>{acc.id}</li>
            <li>{acc.firstName}</li>
            <li>{acc.lastName}</li>
            <li>{acc.email}</li>
            <li className="button__list">
              <button
                onClick={() => {
                  dispatch({ type: "SELECTED_ACCOUNT", payload: acc });
                }}
              >
                View
              </button>

              <button
                onClick={() =>
                  dispatch({ type: "DELETE_ACCOUNT", payload: acc.id })
                }
              >
                Delete
              </button>
            </li>
          </ul>
        ))
      )}
    </div>
  );
}

export default ListItem;
