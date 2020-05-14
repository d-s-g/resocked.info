import React from "react";

const isOwner = (user, id) => {
  if (user === null) return false;
  return user.uid === id ? true : false;
};

const RestokedItem = ({ id, item, handleDelete, user }) => {
  return (
    <ol>
      Up:{item.votesUp}/Down: {item.votesDown} - Item: {item.label} - Restocking
      Day: {item.day}
      {isOwner(user, item.createdBy) && (
        <a onClick={e => handleDelete(e, id, item.document)}>Delete</a>
      )}
    </ol>
  );
};

export default RestokedItem;
