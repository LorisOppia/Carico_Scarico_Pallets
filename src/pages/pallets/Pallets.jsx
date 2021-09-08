import {
  IonContent,
  IonPage,
  IonButton,
  IonToolbar,
  IonTitle,
  IonToast,
  IonLabel,
  IonItem,
  IonActionSheet,
  IonAlert,
  IonGrid,
  IonRow,
  IonCol,
  IonCheckbox,
} from '@ionic/react'
import React, { useState } from 'react'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

import { url } from '../../config/config'

import ReadOnlyRow from '../../components/readOnlyRow';


const Pallets = props => {

  //Visibility Variables
  const [nascondi, setNascondi] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState(false)
  const [showAlert_nuovo, setShowModal_nuovo] = React.useState(false)
  const [showToast_invio, setShowToast_invio] = React.useState(false)
  const [showToast_annulla, setShowToast_annulla] = React.useState(false)
  const [showActionSheet, setShowActionSheet] = React.useState(false)

  //Query Variables
  const [codice, setCodice] = React.useState()
  const [codice_nuovo, setCodice_nuovo] = React.useState()
  const [quantità, setQuantità] = React.useState()
  const [quantità_nuova, setQuantità_nuova] = React.useState()

  const [contacts, setContacts]= React.useState([])
  const [addFormData, setAddFormData] = React.useState({qr: '', carico: ''})
  const [id,setId]= React.useState(0);
  const [checked,setChecked]= React.useState(false);

  const handleAddFormChange = (event) => {
    //event.preventDeafault();
    const fieldName=event.target.getAttribute('name');
    const fieldValue=event.target.value;
    const newFormData ={...addFormData}
    newFormData[fieldName]=fieldValue;
    setAddFormData(newFormData);
    console.log(newFormData);
  }

  const handleAddFormSubmit = () =>{
    //event.preventDeafault();
    const newContact= {
      id: id,
      qr: addFormData.qr,
      carico: addFormData.carico
    }

    const newContacts = [...contacts, newContact]
    setContacts(newContacts);
    setId(id+1);
    console.log(contacts);
  }

  const prendiEInvia=()=>{
    const newContact= {
      id: id,
      qr: codice,
      carico: ""+checked
    }

    const newContacts = [...contacts, newContact]
    setContacts(newContacts);
    setId(id+1);
    
    setCodice();
    setChecked(false);
  }

  const handleDeleteClick= (contactId) =>{
    const newContacts=[...contacts];
    const index = contacts.findIndex((contact)=> contact.id === contactId)
    newContacts.splice(index,1);
    setContacts(newContacts);
  }

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: true });     //chiede permesso fotocamera
    if (status.granted) { startScan() }
    };

  const startScan = async () => {
    setNascondi(true)    //fa vedere la fotocamera
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {setCodice(result.content)
                            setNascondi(false);   //fa vedere la pagina
                            }
  };

  const postPallets = async ()=> {
    var data = {"qr" : "zzzz", "nuova_qt":quantità,"nuovo_qr":"aaaa","qt_sottratta":quantità_nuova};
    try {
    fetch(url,{
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  redirect: 'follow',
  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  setCodice();
  setQuantità();
  setCodice_nuovo();
  setQuantità_nuova();
}
  catch(error){

  }
}

  

    if (nascondi === false){
    return (
    <IonPage>
    <IonToolbar>
        <IonTitle>Home page</IonTitle>
      </IonToolbar>
      <IonContent>

      <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass='my-custom-class'
          header={'Inserisci nuova quantità'}
          inputs={[
            {
              name: 'name',
              type: 'number',
              placeholder: 'Quantità',
            },         
          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {}
            },
            {
              text: 'Ok',
              handler: data => {
                setQuantità(parseInt(data.name))
              }
            }
          ]}
        />

        <IonAlert
          isOpen={showAlert_nuovo}
          onDidDismiss={() => setShowModal_nuovo(false)}
          cssClass='my-custom-class'
          header={'Inserisci quantità sottratta'}
          inputs={[
            {
              name: 'name',
              type: 'number',
              placeholder: 'Quantità',
            },         
          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {}
            },
            {
              text: 'Ok',
              handler: data => {
                setQuantità_nuova(parseInt(data.name))
              }
            }
          ]}
        />

        <IonActionSheet 
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            header= {"Vuoi inviare " + quantità + " oggetti e " + quantità_nuova + " oggetti?"}
            buttons={[{
              text: 'Invio',
              handler: () => { 
                postPallets();
                setShowToast_invio(true)}
            },  {
              text: 'Annulla',
              handler: () => { setShowToast_annulla(true)}
            }]}>
        </IonActionSheet>

        <IonToast
            isOpen={showToast_invio}
            duration={2000}
            onDidDismiss={() => setShowToast_invio(false)}    //dopo 2 secondi si chiude e setta a false
            message="Operazione completata"
            position="bottom"
            color="success"
          />
          <IonToast
            isOpen={showToast_annulla}
            duration={2000}
            onDidDismiss={() => setShowToast_annulla(false)}    //dopo 2 secondi si chiude e setta a false
            message="Operazione annullata"
            position="bottom"
            color="danger"
          />
          
          <IonGrid>
            <IonRow>
              <IonCol size="6"><IonItem>QR</IonItem></IonCol>
              <IonCol size="3"><IonItem>Carico</IonItem></IonCol>
              <IonCol size="3"><IonItem>Rimuovi</IonItem></IonCol>
            </IonRow>
            {contacts.map((contact)=> (
                <ReadOnlyRow contact={contact}
                handleDeleteClick={handleDeleteClick}/>
            ))}
          </IonGrid>
          
            <IonItem>
              <IonLabel>
              QR: {codice}
              </IonLabel>  
              <IonCheckbox checked={checked} onIonChange={e => {setChecked(e.detail.checked)}} />
              <IonButton onClick={() => {checkPermission()}} size="medium" expand="block" slot="end">
                 QR CODE SCAN
              </IonButton>
            </IonItem>

            
            <IonButton  type="submit" size="large" expand="block" color="success" onClick={()=>prendiEInvia()} >Aggiungi</IonButton>  
          
          




            
            <IonItem>
            <IonLabel>
              Nuova quantità: {quantità}
            </IonLabel>
            <IonButton onClick={() => setShowAlert(true)} size="medium" expand="block" slot="end">
                 Inserisci quantità
              </IonButton>
            </IonItem>

            <IonItem>
              <IonLabel>
              QR: {codice_nuovo}
              </IonLabel>  
              <IonButton onClick={() => {checkPermission(1)}} size="medium" expand="block" slot="end">
                 NEW QR CODE SCAN
              </IonButton>
            </IonItem>

            <IonItem>
            <IonLabel>
              Quantità sottratta: {quantità_nuova}
            </IonLabel>
            <IonButton onClick={() => setShowModal_nuovo(true)} size="medium" expand="block" slot="end">
            Inserisci quantità
              </IonButton>
            </IonItem>

            <IonButton onClick={() => setShowActionSheet(true)} size="large" expand="block" color="success" >
                 Invio
            </IonButton>            
      </IonContent>
    </IonPage>
  )}
  else {
    return(
      null
    )
  }
}

export default Pallets
