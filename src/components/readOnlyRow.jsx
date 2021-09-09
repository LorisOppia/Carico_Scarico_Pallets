import React from "react";

import {
    IonRow,
    IonCol,
    IonButton,
    IonCheckbox,
    IonItem,
    IonLabel
  } from '@ionic/react'

const ReadOnlyRow = ({contact, handleDeleteClick}) =>{
    return(
        <IonRow key={contact.id}>
        <IonCol size="6"><IonItem><IonLabel text-wrap>{contact.qr}</IonLabel></IonItem></IonCol>
        <IonCol size="3"><IonItem><IonCheckbox disabled="true" checked={contact.carico}></IonCheckbox></IonItem></IonCol>
        <IonCol size="3"><IonItem><IonButton color="danger" size="medium" onClick={()=>handleDeleteClick(contact.id)}>X</IonButton></IonItem></IonCol>
      </IonRow>
    )
}

export default ReadOnlyRow