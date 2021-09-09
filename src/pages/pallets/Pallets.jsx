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
  IonBackButton,
  IonHeader
} from '@ionic/react'
import React from 'react'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

import { url } from '../../config/config'

import ReadOnlyRow from '../../components/readOnlyRow';


const Pallets = props => {

  //Visibility Variables
  const [hideHomePage, setHideHomePage] = React.useState(false) //vero= mostra fotocamera falso= mostra homepage
  const [showAlert, setShowAlert] = React.useState(false)  //per inserire nuova quantità del pallets se serve
  const [showToastSendButton, setShowToastSendButton] = React.useState(false) //barra sotto per invio
  const [showToastCancelButton, setShowToastCancelButton] = React.useState(false) //barra sotto per annulla
  const [showActionSheet, setShowActionSheet] = React.useState(false) //barra dopo premuto invio
  const [showToastError, setShowToastError] = React.useState(false) //barra sotto per eroore connessione DB

  //Query Variables
  const [code, setCode] = React.useState()
  const [quantity, setQuantity] = React.useState()

  const [pallets, setPallets]= React.useState([])
  const [id,setId]= React.useState(0);
  const [checked,setChecked]= React.useState(false);

  const addPallets=()=>{
    const newPallet= {
      id: id,
      qr: code,
      carico: ""+checked
    }

    const newPallets = [...pallets, newPallet]
    setPallets(newPallets);
    setId(id+1);
    
    setCode();
    setChecked(false);
    //console.log(pallets)
  }

  const handleDeleteClick= (palletId) =>{
    const newPallets=[...pallets];
    const index = pallets.findIndex((contact)=> contact.id === palletId)
    newPallets.splice(index,1);
    setPallets(newPallets);
  }

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: true });     //chiede permesso fotocamera
    if (status.granted) { startScan() }
    };

  const startScan = async () => {
    setHideHomePage(true)    //fa vedere la fotocamera
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {setCode(result.content)
                            setHideHomePage(false);   //fa vedere la pagina
                            }
  };

  const postPallets = async (data)=> {
    try {
      await fetch(url,{
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
    setShowToastSendButton(true)
    setCode();
    setQuantity();
    setPallets([])
}
  catch(error){
    setShowToastError(true);
  }
}

  const dividePallets = async()=>{
    console.log(pallets)
    for (var pallet of pallets){
      var data={"qr":pallet.qr,"carico":pallet.carico}
      //console.log(data);
      await postPallets(data);
    }
  }

    if (hideHomePage === false){
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
                setQuantity(parseInt(data.name))
              }
            }
          ]}
        />

        <IonActionSheet 
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            header= {"Vuoi modificare"+id+"pallets?"}
            buttons={[{
              text: 'Invio',
              handler: () => { 
                dividePallets();
                }
            },  {
              text: 'Annulla',
              handler: () => {setShowToastCancelButton(true)}
            }]}>
        </IonActionSheet>

        <IonToast
            isOpen={showToastSendButton}
            duration={1000}
            onDidDismiss={() => setShowToastSendButton(false)}    //dopo 2 secondi si chiude e setta a false
            message="Operazione completata"
            position="bottom"
            color="success"
          />
          <IonToast
            isOpen={showToastCancelButton}
            duration={1000}
            onDidDismiss={() => setShowToastCancelButton(false)}    //dopo 2 secondi si chiude e setta a false
            message="Operazione annullata"
            position="bottom"
            color="danger"
          />
          <IonToast
            isOpen={showToastError}
            duration={1000}
            onDidDismiss={() => setShowToastCancelButton(false)}    //dopo 2 secondi si chiude e setta a false
            message="Connessione con il Database non riuscita. Riprova"
            position="bottom"
            color="danger"
          />
          
          <IonGrid>
            <IonRow kew="header">
              <IonCol size="6"><IonItem>QR</IonItem></IonCol>
              <IonCol size="3"><IonItem>Carico</IonItem></IonCol>
              <IonCol size="3"><IonItem>Rimuovi</IonItem></IonCol>
            </IonRow>
            {pallets.map((contact)=> (
                <ReadOnlyRow contact={contact}
                handleDeleteClick={handleDeleteClick}/>
            ))}
          </IonGrid>
          </IonContent>
          
            <IonItem>
              <IonLabel>
              QR: {code}
              </IonLabel>  
              <IonCheckbox checked={checked} onIonChange={e => {setChecked(e.detail.checked)}} />
              <IonButton onClick={() => {checkPermission()}/*setCode(Math.floor(Math.random()*1000));}*/} size="medium" expand="block" slot="end">
                 QR CODE SCAN
              </IonButton>
            </IonItem>
          
            
            <IonButton  type="submit" size="large" expand="block"  onClick={()=>addPallets()} >Aggiungi</IonButton>  
          
            <IonButton onClick={() => setShowActionSheet(true)} size="large" expand="block" color="success" >
                 Invio
            </IonButton>            

    </IonPage>
  )}
  if(hideHomePage === true) {
    return(
     
      <IonHeader>
      <IonToolbar>
        <IonButton slot="end" >
          <IonBackButton text="Indietro" defaultHref="/" onClick={() => {BarcodeScanner.stopScan(); setHideHomePage(false)}}/>
       </IonButton>
      </IonToolbar>
    </IonHeader>
      
    )
  }
}

export default Pallets
