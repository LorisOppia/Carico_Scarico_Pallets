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
  IonAlert,
  IonToast,
  IonActionSheet,
  IonIcon,
  IonLoading,
} from '@ionic/react'
import { useState } from 'react'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { App } from '@capacitor/app';
import { settingsOutline } from 'ionicons/icons'
import { url } from "../../config/config";

const Pallets = () => {

  App.addListener('backButton', () => {
    BarcodeScanner.stopScan()
    setNascondi(false)
  })

  const invia = async () => {
    let carico
    let data = {}
    setShowLoading(true)
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
    catch(error){setShowToastErr(true); 
      setShowLoading(false) ;return}
  }
  setRighe([])
  setTesto([])
  setShowToastInvio(true)
  setShowLoading(false)
  }

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status.granted) { startScan() }
    };

  const startScan = async () => {
    setNascondi(true)
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) { setRighe(righe => [result.content, ...righe]);
                            setTesto(testo => ["Carico", ...testo]);
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

  const salva = () => {
    setRigheSalva(righe);
    setTestoSalva(testo)
    setRighe([])
    setTesto([])
    };
  
  const recupera = () => {
    setRighe(righeSalva)
    setTesto(testoSalva)
    setRigheSalva([])
    setTestoSalva([])
  };

  const changeAllToScarica = () => {
    let app = []
    for (let i=0;i<righe.length;i++){
      app.push("Scarico")
    }
    setTesto(app);
  }

  const changeAllToCarica = () => {
    let app = []
    for (let i=0;i<righe.length;i++){
      app.push("Carico")
    }
    setTesto(app);
  }

  const [righe, setRighe] = useState([])
  const [righeSalva, setRigheSalva] = useState([])
  const [nascondi, setNascondi] = useState(false)
  const [testo, setTesto] = useState([])
  const [testoSalva, setTestoSalva] = useState([])
  const [showAlertRimuovi, setShowAlertRimuovi] = useState(false)
  const [showAlertInvia, setShowAlertInvia] = useState(false)
  const [showAlertNoElem, setShowAlertNoElem] = useState(false)
  const [showToastInvio, setShowToastInvio] = useState(false)
  const [showToastErr, setShowToastErr] = useState(false)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showAlertSalva, setShowAlertSalva] = useState(false)
  const [showLoading, setShowLoading] = useState(false)


  if (nascondi===false){
    return(
    <IonPage>
    <IonToolbar>
        <IonTitle>Home page</IonTitle>
      </IonToolbar>

      <IonItem>
        Elementi inseriti: {righe.length}
        <IonButton color="light" size="medium" slot="end" onClick={()=>setShowActionSheet(true)}> <IonIcon icon={settingsOutline}/></IonButton>
      </IonItem>

      <IonContent>
        {righe.map((_,i) => (<IonItemSliding key={i} id={i}>
                                <IonItemOptions side="end" >
                                  <IonItemOption color="danger" onClick={() => {rimuovi(i); chiudi(i)}}>
                                  Rimuovi
                                  </IonItemOption>
                                </IonItemOptions>
                                <IonItem>
                                  {righe.length-i} - {righe[i]}
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
            <IonButton slot="start" color="success" size="large" onClick={() => {if (righe.length===0) {setShowAlertNoElem(true)} 
                                                                                 else {setShowAlertInvia(true)}}}>
                    Invia
                </IonButton>

            <IonButton onClick={() => {/*setRighe(righe => [Math.floor(Math.random() * 50), ...righe]);
                                       setTesto(testo => ["Carico", ...testo])*/ checkPermission()}} size="large" slot="end">       
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
              handler: () => { salva() }
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
          isOpen={showAlertSalva}
          onDidDismiss={() => setShowAlertSalva(false)}
          header={'Non ci sono elementi da recuperare'}
          buttons={[
            {
              text: 'Ok',
              handler: () => {setShowAlertSalva(false)}
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
          <IonToast
            isOpen={showToastErr}
            duration={2000}
            onDidDismiss={() => setShowToastErr(false)}
            message="Errore"
            position="bottom"
            color="danger"
          />

          <IonActionSheet 
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            header= {"Opzioni"}
            buttons={[{
              text: 'Rimuovi Tutti',
              handler: () => {if (righe.length===0){setShowAlertNoElem(true)} 
                              else {setShowAlertRimuovi(true)}}
            },  {
              text: 'Imposta tutti: Carico',
              handler: () => { changeAllToCarica()}
            },{
              text: 'Imposta tutti: Scarico',
              handler: () => {changeAllToScarica()}
            },{
              text: 'Recupera elementi',
              handler: () => {if (righeSalva.length===0) {setShowAlertSalva(true)}
                              else {recupera()}}
            },
            ]}>
        </IonActionSheet>

        <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Invio in corso...'}
      />
      
    </IonPage>
  )
        }
  else { return null}
}

export default Pallets
