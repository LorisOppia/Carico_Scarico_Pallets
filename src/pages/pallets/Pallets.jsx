import {
  IonContent,
  IonPage,
  IonButton,
  IonToolbar,
  IonTitle,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonBackButton,
  IonAlert,
  IonToast,
} from '@ionic/react'
import {useState} from 'react'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { App } from '@capacitor/app';

const Pallets = () => {

  App.addListener('backButton', () => {
    setNascondi(false)
  })

  const invia = async () => {
    let url = "http://127.0.0.1:8000/caricoScaricoPallets/"
    let carico
    let data = {}
    for (let i = 0;i<righe.length; i++){
    carico = false
    if (testo[i]==="Carico") {carico=true}
    data = {"qr":righe[i].toString(),"carico":carico}
      try {
        await fetch(url,{
          method: 'POST', 
          mode: 'cors', 
          cache: 'no-cache', 
          credentials: 'same-origin', 
          headers: { 'Content-Type': 'application/json'},
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(data) 
      });
  }
    catch(error){
    }
  }
  if (righe.length>0){setRighe([])
                      setTesto([])
                      setShowToastInvio(true)}
  }

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status.granted) { startScan() }
    };

  const startScan = async () => {
    setNascondi(true)
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) { setRighe(righe => [...righe, result.content]);
                            setTesto(testo => [...testo, "Carico"]);
                            setNascondi(false); }
    }; 
    
  const rimuovi = (x) => {
    let app0 = [...testo]
    let app = [...righe]
    app.splice(x,1)
    app0.splice(x,1)
    setRighe(app)
    setTesto(app0)
    };

  const chiudi = (id) => {
    document.getElementById(id).close();
  };

  const [righe, setRighe] = useState([])
  const [nascondi, setNascondi] = useState(false)
  const [testo, setTesto] = useState([])
  const [showAlertRimuovi, setShowAlertRimuovi] = useState(false)
  const [showAlertInvia, setShowAlertInvia] = useState(false)
  const [showAlertNoElem, setShowAlertNoElem] = useState(false)
  const [showToastInvio, setShowToastInvio] = useState(false)
  
  if (nascondi===false){
    return (
    <IonPage>
    <IonToolbar>
        <IonTitle>Home page</IonTitle>
      </IonToolbar>

      <IonItem>
        Codici inseriti: {righe.length}
        <IonButton slot="end" color="danger" size="medium" onClick={() => setShowAlertRimuovi(true)}>Rimuovi tutti</IonButton>
      </IonItem>

      <IonContent>
        {righe.map((_,i) => (<IonItemSliding key={i} id={i}>
                                <IonItemOptions side="end" >
                                  <IonItemOption color="danger" onClick={() => {rimuovi(i); chiudi(i)}}>
                                  Cancella
                                  </IonItemOption>
                                </IonItemOptions>
                                <IonItem>
                                  {righe[i]}
                                  <IonLabel slot="end" onClick={() => {let app=[...testo]; if (testo[i]==="Carico") {app[i]="Scarico"}
                                                                                            else {app[i]="Carico"}
                                                                        setTesto(app)
                                                                        }}>
                                    {testo[i]}
                                  </IonLabel>
                                </IonItem>
                              </IonItemSliding>))}
      </IonContent>

      <IonItem>
            <IonButton slot="start" color="success" size="large" onClick={() => {if (righe.length===0){setShowAlertNoElem(true)} 
                                                                                 else {setShowAlertInvia(true)}}}>Invia</IonButton>
            <IonButton onClick={() => checkPermission()} size="large" slot="end">       
                 Scan
            </IonButton>
      </IonItem>
      <IonAlert
          isOpen={showAlertRimuovi}
          onDidDismiss={() => setShowAlertRimuovi(false)}
          header={'Vuoi rimuovere tutti gli elementi?'}
          buttons={[
            {
              text: 'Annulla',
              handler: () => {setShowAlertRimuovi(false)}
            },
            {
              text: 'Rimuovi',
              handler: () => { setRighe([]); setTesto([]) }
            }
          ]}
        /> 
        <IonAlert
          isOpen={showAlertInvia}
          onDidDismiss={() => setShowAlertInvia(false)}
          header={'Vuoi inviare ' + righe.length +' elementi?'}
          buttons={[
            {
              text: 'Annulla',
              handler: () => {setShowAlertInvia(false)}
            },
            {
              text: 'Invia',
              handler: () => {invia()}
            }
          ]}
        />
        <IonAlert
          isOpen={showAlertNoElem}
          onDidDismiss={() => setShowAlertNoElem(false)}
          header={'Non ci sono elementi'}
          buttons={[
            {
              text: 'Ok',
              handler: () => {setShowAlertNoElem(false)}
            }
          ]}
        />
        <IonToast
            isOpen={showToastInvio}
            duration={2000}
            onDidDismiss={() => setShowToastInvio(false)}
            message="Operazione completata"
            position="bottom"
            color="success"
          />
      
    </IonPage>
  )
        }
  else {
    return(
      <IonToolbar>
        <IonButton slot="end" >
          <IonBackButton text="Indietro" defaultHref="/" onClick={() => setNascondi(false)}/>
       </IonButton>
      </IonToolbar>
  )}
}

export default Pallets
