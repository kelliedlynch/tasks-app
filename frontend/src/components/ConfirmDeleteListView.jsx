import React from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ConfirmDeleteListView({ show, hide, listName, didDeleteList, closeConfirmModal }) {
  function confirmDelete() {
    didDeleteList();
    closeConfirmModal();
  }

  return (
    <Modal show={show} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title className="theme-accent">
          Delete List "{listName}"?
        </Modal.Title>
      </Modal.Header>
        <Modal.Body>
          This will delete the list and all the items in it. Proceed?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="button" onClick={confirmDelete}>Delete</Button>
          <Button variant="secondary" type="button" onClick={closeConfirmModal}>Cancel</Button>
        </Modal.Footer>
    </Modal>
    );
}

export default ConfirmDeleteListView;
