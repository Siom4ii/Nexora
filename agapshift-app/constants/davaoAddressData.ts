/**
 * AgapShift - Davao del Sur Exclusive Address Data
 * Focuses strictly on Davao del Sur as per target user requirements.
 */

export const DAVAO_DATA = {
  region: { id: '11', name: 'Region XI - Davao Region' },
  provinces: [
    { id: '11-1', name: 'Davao del Sur' }
  ],
  municipalities: {
    '11-1': [
      { id: 'm-dav', name: 'Davao City' },
      { id: 'm-dig', name: 'Digos City' },
      { id: 'm-ban', name: 'Bansalan' },
      { id: 'm-hag', name: 'Hagonoy' },
      { id: 'm-kib', name: 'Kiblawan' },
      { id: 'm-mag', name: 'Magsaysay' },
      { id: 'm-mal', name: 'Malalag' },
      { id: 'm-mat', name: 'Matanao' },
      { id: 'm-pad', name: 'Padada' },
      { id: 'm-stc', name: 'Santa Cruz' },
      { id: 'm-sul', name: 'Sulop' }
    ]
  },
  barangays: {
    // Davao City (All 182 Barangays)
    'm-dav': [
      // Poblacion
      { id: 'd-p1', name: '1-A' }, { id: 'd-p2', name: '2-A' }, { id: 'd-p3', name: '3-A' }, { id: 'd-p4', name: '4-A' }, { id: 'd-p5', name: '5-A' },
      { id: 'd-p6', name: '6-A' }, { id: 'd-p7', name: '7-A' }, { id: 'd-p8', name: '8-A' }, { id: 'd-p9', name: '9-A' }, { id: 'd-p10', name: '10-A' },
      { id: 'd-p11', name: '11-B' }, { id: 'd-p12', name: '12-B' }, { id: 'd-p13', name: '13-B' }, { id: 'd-p14', name: '14-B' }, { id: 'd-p15', name: '15-B' },
      { id: 'd-p16', name: '16-B' }, { id: 'd-p17', name: '17-B' }, { id: 'd-p18', name: '18-B' }, { id: 'd-p19', name: '19-B' }, { id: 'd-p20', name: '20-B' },
      { id: 'd-p21', name: '21-C' }, { id: 'd-p22', name: '22-C' }, { id: 'd-p23', name: '23-C' }, { id: 'd-p24', name: '24-C' }, { id: 'd-p25', name: '25-C' },
      { id: 'd-p26', name: '26-C' }, { id: 'd-p27', name: '27-C' }, { id: 'd-p28', name: '28-C' }, { id: 'd-p29', name: '29-C' }, { id: 'd-p30', name: '30-C' },
      { id: 'd-p31', name: '31-D' }, { id: 'd-p32', name: '32-D' }, { id: 'd-p33', name: '33-D' }, { id: 'd-p34', name: '34-D' }, { id: 'd-p35', name: '35-D' },
      { id: 'd-p36', name: '36-D' }, { id: 'd-p37', name: '37-D' }, { id: 'd-p38', name: '38-D' }, { id: 'd-p39', name: '39-D' }, { id: 'd-p40', name: '40-D' },
      // Talomo
      { id: 'd-t1', name: 'Bago Aplaya' }, { id: 'd-t2', name: 'Bago Gallera' }, { id: 'd-t3', name: 'Baliok' }, { id: 'd-t4', name: 'Bucana' },
      { id: 'd-t5', name: 'Catalunan Grande' }, { id: 'd-t6', name: 'Catalunan Pequeño' }, { id: 'd-t7', name: 'Dumoy' }, { id: 'd-t8', name: 'Langub' },
      { id: 'd-t9', name: 'Ma-a' }, { id: 'd-t10', name: 'Magtuod' }, { id: 'd-t11', name: 'Matina Aplaya' }, { id: 'd-t12', name: 'Matina Crossing' },
      { id: 'd-t13', name: 'Matina Pangi' }, { id: 'd-t14', name: 'Talomo Proper' },
      // Agdao
      { id: 'd-a1', name: 'Agdao Proper' }, { id: 'd-a2', name: 'Centro (San Juan)' }, { id: 'd-a3', name: 'Gov. Paciano Bangoy' },
      { id: 'd-a4', name: 'Gov. Vicente Duterte' }, { id: 'd-a5', name: 'Kap. Tomas Monteverde Sr.' }, { id: 'd-a6', name: 'Lapu-Lapu' },
      { id: 'd-a7', name: 'Leon Garcia' }, { id: 'd-a8', name: 'Rafael Castillo' }, { id: 'd-a9', name: 'San Antonio' },
      { id: 'd-a10', name: 'Ubalde' }, { id: 'd-a11', name: 'Wilfredo Aquino' },
      // Buhangin
      { id: 'd-bu1', name: 'Acacia' }, { id: 'd-bu2', name: 'Alfonso Angliongto Sr.' }, { id: 'd-bu3', name: 'Buhangin Proper' },
      { id: 'd-bu4', name: 'Cabantian' }, { id: 'd-bu5', name: 'Callawa' }, { id: 'd-bu6', name: 'Communal' },
      { id: 'd-bu7', name: 'Indangan' }, { id: 'd-bu8', name: 'Mandug' }, { id: 'd-bu9', name: 'Pampanga' },
      { id: 'd-bu10', name: 'Sasa' }, { id: 'd-bu11', name: 'Tigatto' }, { id: 'd-bu12', name: 'Vicente Hizon Sr.' }, { id: 'd-bu13', name: 'Waan' },
      // Bunawan
      { id: 'd-bn1', name: 'Alejandra Navarro (Lasang)' }, { id: 'd-bn2', name: 'Bunawan Proper' }, { id: 'd-bn3', name: 'Gatungan' },
      { id: 'd-bn4', name: 'Ilang' }, { id: 'd-bn5', name: 'Mahayag' }, { id: 'd-bn6', name: 'Mudiang' },
      { id: 'd-bn7', name: 'Panacan' }, { id: 'd-bn8', name: 'San Isidro (Licanan)' }, { id: 'd-bn9', name: 'Tibungco' },
      // Paquibato
      { id: 'd-paq1', name: 'Colosas' }, { id: 'd-paq2', name: 'Fatima (Benowang)' }, { id: 'd-paq3', name: 'Lumiad' },
      { id: 'd-paq4', name: 'Mabuhay' }, { id: 'd-paq5', name: 'Malabog' }, { id: 'd-paq6', name: 'Mapula' },
      { id: 'd-paq7', name: 'Panalum' }, { id: 'd-paq8', name: 'Pandaitan' }, { id: 'd-paq9', name: 'Paquibato Proper' },
      { id: 'd-paq10', name: 'Paradise Embak' }, { id: 'd-paq11', name: 'Salapawan' }, { id: 'd-paq12', name: 'Sumimao' }, { id: 'd-paq13', name: 'Tapak' },
      // Baguio
      { id: 'd-bag1', name: 'Baguio Proper' }, { id: 'd-bag2', name: 'Cadalian' }, { id: 'd-bag3', name: 'Carmen' },
      { id: 'd-bag4', name: 'Gumalang' }, { id: 'd-bag5', name: 'Malagos' }, { id: 'd-bag6', name: 'Tambobong' },
      { id: 'd-bag7', name: 'Tawan-Tawan' }, { id: 'd-bag8', name: 'Wines' },
      // Calinan
      { id: 'd-cal1', name: 'Biao Joaquin' }, { id: 'd-cal2', name: 'Calinan Proper' }, { id: 'd-cal3', name: 'Cawayan' },
      { id: 'd-cal4', name: 'Dacudao' }, { id: 'd-cal5', name: 'Dalagdag' }, { id: 'd-cal6', name: 'Dominga' },
      { id: 'd-cal7', name: 'Inayangan' }, { id: 'd-cal8', name: 'Lacson' }, { id: 'd-cal9', name: 'Lamanan' },
      { id: 'd-cal10', name: 'Lampianao' }, { id: 'd-cal11', name: 'Megkawayan' }, { id: 'd-cal12', name: 'Pangyan' },
      { id: 'd-cal13', name: 'Riverside' }, { id: 'd-cal14', name: 'Saloy' }, { id: 'd-cal15', name: 'Sirib' },
      { id: 'd-cal16', name: 'Subasta' }, { id: 'd-cal17', name: 'Talomo River' }, { id: 'd-cal18', name: 'Tamayong' }, { id: 'd-cal19', name: 'Wangan' },
      // Marilog
      { id: 'd-mar1', name: 'Baganihan' }, { id: 'd-mar2', name: 'Bantol' }, { id: 'd-mar3', name: 'Buda' },
      { id: 'd-mar4', name: 'Dalag' }, { id: 'd-mar5', name: 'Datu Salumay' }, { id: 'd-mar6', name: 'Gumitan' },
      { id: 'd-mar7', name: 'Magsaysay' }, { id: 'd-mar8', name: 'Malamba' }, { id: 'd-mar9', name: 'Marilog Proper' },
      { id: 'd-mar10', name: 'Salaysay' }, { id: 'd-mar11', name: 'Suawan (Tuli)' }, { id: 'd-mar12', name: 'Tamugan' },
      // Toril
      { id: 'd-tor1', name: 'Alambre' }, { id: 'd-tor2', name: 'Atan-Awe' }, { id: 'd-tor3', name: 'Bangkas Heights' },
      { id: 'd-tor4', name: 'Baracatan' }, { id: 'd-tor5', name: 'Bato' }, { id: 'd-tor6', name: 'Bayabas' },
      { id: 'd-tor7', name: 'Binugao' }, { id: 'd-tor8', name: 'Camansi' }, { id: 'd-tor9', name: 'Catigan' },
      { id: 'd-tor10', name: 'Crossing Bayabas' }, { id: 'd-tor11', name: 'Daliao' }, { id: 'd-tor12', name: 'Daliaon Plantation' },
      { id: 'd-tor13', name: 'Eden' }, { id: 'd-tor14', name: 'Kilate' }, { id: 'd-tor15', name: 'Lizada' },
      { id: 'd-tor16', name: 'Lubogan' }, { id: 'd-tor17', name: 'Marapangi' }, { id: 'd-tor18', name: 'Mulig' },
      { id: 'd-tor19', name: 'Sibulan' }, { id: 'd-tor20', name: 'Sirawan' }, { id: 'd-tor21', name: 'Tagluno' },
      { id: 'd-tor22', name: 'Tibuloy' }, { id: 'd-tor23', name: 'Toril Proper' }, { id: 'd-tor24', name: 'Tungkalan' },
      // Tugbok
      { id: 'd-tug1', name: 'Angalan' }, { id: 'd-tug2', name: 'Bago Oshiro' }, { id: 'd-tug3', name: 'Balenggaeng' },
      { id: 'd-tug4', name: 'Biao Escuela' }, { id: 'd-tug5', name: 'Biao Guinga' }, { id: 'd-tug6', name: 'Los Amigos' },
      { id: 'd-tug7', name: 'Manambulan' }, { id: 'd-tug8', name: 'Manuel Guianga' }, { id: 'd-tug9', name: 'Matina Biao' },
      { id: 'd-tug10', name: 'Mintal' }, { id: 'd-tug11', name: 'New Carmen' }, { id: 'd-tug12', name: 'New Valencia' },
      { id: 'd-tug13', name: 'Santo Niño' }, { id: 'd-tug14', name: 'Tacunan' }, { id: 'd-tug15', name: 'Tagakpan' },
      { id: 'd-tug16', name: 'Talandang' }, { id: 'd-tug17', name: 'Tugbok Proper' }, { id: 'd-tug18', name: 'Ula' }
    ],
    // Digos City
    'm-dig': [
      { id: 'di1', name: 'Aplaya' }, { id: 'di2', name: 'Balabag' }, { id: 'di3', name: 'Binaton' }, { id: 'di4', name: 'Cogon' },
      { id: 'di5', name: 'Colorado' }, { id: 'di6', name: 'Dawis' }, { id: 'di7', name: 'Dulangan' }, { id: 'di8', name: 'Goma' },
      { id: 'di9', name: 'Igpit' }, { id: 'di10', name: 'Kapatagan (Rizal)' }, { id: 'di11', name: 'Kiagot' }, { id: 'di12', name: 'Lungag' },
      { id: 'di13', name: 'Mahayahay' }, { id: 'di14', name: 'Matti' }, { id: 'di15', name: 'Ruparan' }, { id: 'di16', name: 'San Agustin' },
      { id: 'di17', name: 'San Jose (Balutakay)' }, { id: 'di18', name: 'San Miguel (Odaca)' }, { id: 'di19', name: 'San Roque' },
      { id: 'di20', name: 'Sinawilan' }, { id: 'di21', name: 'Soong' }, { id: 'di22', name: 'Tiguman' }, { id: 'di23', name: 'Tres de Mayo' },
      { id: 'di24', name: 'Zone 1 (Poblacion)' }, { id: 'di25', name: 'Zone 2 (Poblacion)' }, { id: 'di26', name: 'Zone 3 (Poblacion)' }
    ],
    // Bansalan
    'm-ban': [
      { id: 'ba1', name: 'Alegre' }, { id: 'ba2', name: 'Alta Vista' }, { id: 'ba3', name: 'Anonang' }, { id: 'ba4', name: 'Bitaug' },
      { id: 'ba5', name: 'Bonifacio' }, { id: 'ba6', name: 'Buenavista' }, { id: 'ba7', name: 'Darapuay' }, { id: 'ba8', name: 'Dolo' },
      { id: 'ba9', name: 'Eman' }, { id: 'ba10', name: 'Kinuskusan' }, { id: 'ba11', name: 'Libertad' }, { id: 'ba12', name: 'Linawan' },
      { id: 'ba13', name: 'Mabuhay' }, { id: 'ba14', name: 'Mabunga' }, { id: 'ba15', name: 'Managa' }, { id: 'ba16', name: 'Marber' },
      { id: 'ba17', name: 'New Clarin' }, { id: 'ba18', name: 'Poblacion' }, { id: 'ba19', name: 'Poblacion Dos' }, { id: 'ba20', name: 'Rizal' },
      { id: 'ba21', name: 'Santo Niño' }, { id: 'ba22', name: 'Sibayan' }, { id: 'ba23', name: 'Tinongtongan' }, { id: 'ba24', name: 'Tubod' },
      { id: 'ba25', name: 'Union' }
    ],
    // Hagonoy
    'm-hag': [
      { id: 'ha1', name: 'Balutakay' }, { id: 'ha2', name: 'Clib' }, { id: 'ha3', name: 'Guihing' }, { id: 'ha4', name: 'Guihing Aplaya' },
      { id: 'ha5', name: 'Hagonoy Crossing' }, { id: 'ha6', name: 'Kibuaya' }, { id: 'ha7', name: 'La Union' }, { id: 'ha8', name: 'Lanuro' },
      { id: 'ha9', name: 'Lapulabao' }, { id: 'ha10', name: 'Leling' }, { id: 'ha11', name: 'Mahayahay' }, { id: 'ha12', name: 'Malabang Damsite' },
      { id: 'ha13', name: 'Maliit Digos' }, { id: 'ha14', name: 'New Quezon' }, { id: 'ha15', name: 'Paligue' }, { id: 'ha16', name: 'Poblacion' },
      { id: 'ha17', name: 'Sacub' }, { id: 'ha18', name: 'San Guillermo' }, { id: 'ha19', name: 'San Isidro' }, { id: 'ha20', name: 'Sinayawan' },
      { id: 'ha21', name: 'Tologan' }
    ],
    // Kiblawan
    'm-kib': [
      { id: 'ki1', name: 'Abnate' }, { id: 'ki2', name: 'Bagong Negros' }, { id: 'ki3', name: 'Bagong Silang' }, { id: 'ki4', name: 'Bagumbayan' },
      { id: 'ki5', name: 'Balasiao' }, { id: 'ki6', name: 'Bonifacio' }, { id: 'ki7', name: 'Bulol-Salo' }, { id: 'ki8', name: 'Bunot' },
      { id: 'ki9', name: 'Cogon-Bacaca' }, { id: 'ki10', name: 'Dapok' }, { id: 'ki11', name: 'Ihan' }, { id: 'ki12', name: 'Kibongbong' },
      { id: 'ki13', name: 'Kimlawis' }, { id: 'ki14', name: 'Kisulan' }, { id: 'ki15', name: 'Lati-an' }, { id: 'ki16', name: 'Manual' },
      { id: 'ki17', name: 'Maraga-a' }, { id: 'ki18', name: 'Molopolo' }, { id: 'ki19', name: 'New Sibonga' }, { id: 'ki20', name: 'Panaglib' },
      { id: 'ki21', name: 'Pasig' }, { id: 'ki22', name: 'Poblacion' }, { id: 'ki23', name: 'Pocaleel' }, { id: 'ki24', name: 'San Isidro' },
      { id: 'ki25', name: 'San Jose' }, { id: 'ki26', name: 'San Pedro' }, { id: 'ki27', name: 'Santo Niño' }, { id: 'ki28', name: 'Tacub' },
      { id: 'ki29', name: 'Tacul' }, { id: 'ki30', name: 'Waterfall' }
    ],
    // Magsaysay
    'm-mag': [
      { id: 'ma1', name: 'Bacungan' }, { id: 'ma2', name: 'Balnate' }, { id: 'ma3', name: 'Barayong' }, { id: 'ma4', name: 'Blocon' },
      { id: 'ma5', name: 'Dalawinon' }, { id: 'ma6', name: 'Dalumay' }, { id: 'ma7', name: 'Glamang' }, { id: 'ma8', name: 'Kanapulo' },
      { id: 'ma9', name: 'Kasuga' }, { id: 'ma10', name: 'Lower Bala' }, { id: 'ma11', name: 'Mabini' }, { id: 'ma12', name: 'Maibo' },
      { id: 'ma13', name: 'Malawanit' }, { id: 'ma14', name: 'Malongon' }, { id: 'ma15', name: 'New Ilocos' }, { id: 'ma16', name: 'New Opon' },
      { id: 'ma17', name: 'Poblacion' }, { id: 'ma18', name: 'San Isidro' }, { id: 'ma19', name: 'San Miguel' }, { id: 'ma20', name: 'Tacul' },
      { id: 'ma21', name: 'Tagaytay' }, { id: 'ma22', name: 'Upper Bala' }
    ],
    // Malalag
    'm-mal': [
      { id: 'ml1', name: 'Bagumbayan' }, { id: 'ml2', name: 'Baybay' }, { id: 'ml3', name: 'Bolton' }, { id: 'ml4', name: 'Bulacan' },
      { id: 'ml5', name: 'Caputian' }, { id: 'ml6', name: 'Ibo' }, { id: 'ml7', name: 'Kiblagon' }, { id: 'ml8', name: 'Lapla' },
      { id: 'ml9', name: 'Mabini' }, { id: 'ml10', name: 'New Baclayon' }, { id: 'ml11', name: 'Pitu' }, { id: 'ml12', name: 'Poblacion' },
      { id: 'ml13', name: 'Rizal' }, { id: 'ml14', name: 'San Isidro' }, { id: 'ml15', name: 'Tagansule' }
    ],
    // Matanao
    'm-mat': [
      { id: 'mt1', name: 'Asbang' }, { id: 'mt2', name: 'Asinan' }, { id: 'mt3', name: 'Bagumbayan' }, { id: 'mt4', name: 'Bangkal' },
      { id: 'mt5', name: 'Buas' }, { id: 'mt6', name: 'Buri' }, { id: 'mt7', name: 'Cabligan' }, { id: 'mt8', name: 'Camanchiles' },
      { id: 'mt9', name: 'Ceboza' }, { id: 'mt10', name: 'Colonsabak' }, { id: 'mt11', name: 'Dongan-Pekong' }, { id: 'mt12', name: 'Kabasagan' },
      { id: 'mt13', name: 'Kapok' }, { id: 'mt14', name: 'Kauswagan' }, { id: 'mt15', name: 'Kibao' }, { id: 'mt16', name: 'La Suerte' },
      { id: 'mt17', name: 'Langa-an' }, { id: 'mt18', name: 'Lower Marber' }, { id: 'mt19', name: 'Manga' }, { id: 'mt20', name: 'New Katipunan' },
      { id: 'mt21', name: 'New Murcia' }, { id: 'mt22', name: 'New Visayas' }, { id: 'mt23', name: 'Poblacion' }, { id: 'mt24', name: 'Saboy' },
      { id: 'mt25', name: 'San Jose' }, { id: 'mt26', name: 'San Miguel' }, { id: 'mt27', name: 'San Vicente' }, { id: 'mt28', name: 'Saub' },
      { id: 'mt29', name: 'Sinaragan' }, { id: 'mt30', name: 'Sinawilan' }, { id: 'mt31', name: 'Tamlangon' }, { id: 'mt32', name: 'Tibongbong' },
      { id: 'mt33', name: 'Towak' }
    ],
    // Padada
    'm-pad': [
      { id: 'pa1', name: 'Almendras' }, { id: 'pa2', name: 'Don Sergio Osmeña, Sr.' }, { id: 'pa3', name: 'Harada Butai' },
      { id: 'pa4', name: 'Lower Katipunan' }, { id: 'pa5', name: 'Lower Limonzo' }, { id: 'pa6', name: 'Lower Malinao' },
      { id: 'pa7', name: 'N C Ordaneza District' }, { id: 'pa8', name: 'Northern Paligue' }, { id: 'pa9', name: 'Palili' },
      { id: 'pa10', name: 'Piape' }, { id: 'pa11', name: 'Punta Piape' }, { id: 'pa12', name: 'Quirino District' },
      { id: 'pa13', name: 'San Isidro' }, { id: 'pa14', name: 'Southern Paligue' }, { id: 'pa15', name: 'Tulogan' },
      { id: 'pa16', name: 'Upper Limonzo' }, { id: 'pa17', name: 'Upper Malinao' }
    ],
    // Santa Cruz
    'm-stc': [
      { id: 'sc1', name: 'Astorga' }, { id: 'sc2', name: 'Bato' }, { id: 'sc3', name: 'Coronon' }, { id: 'sc4', name: 'Darong' },
      { id: 'sc5', name: 'Inawayan' }, { id: 'sc6', name: 'Jose Rizal' }, { id: 'sc7', name: 'Matutungan' }, { id: 'sc8', name: 'Melilia' },
      { id: 'sc9', name: 'Saliducon' }, { id: 'sc10', name: 'Sibulan' }, { id: 'sc11', name: 'Sinaron' }, { id: 'sc12', name: 'Tagabuli' },
      { id: 'sc13', name: 'Tibolo' }, { id: 'sc14', name: 'Tuban' }, { id: 'sc15', name: 'Zone I (Poblacion)' },
      { id: 'sc16', name: 'Zone II (Poblacion)' }, { id: 'sc17', name: 'Zone III (Poblacion)' }, { id: 'sc18', name: 'Zone IV (Poblacion)' }
    ],
    // Sulop
    'm-sul': [
      { id: 'su1', name: 'Balasinon' }, { id: 'su2', name: 'Buguis' }, { id: 'su3', name: 'Carre' }, { id: 'su4', name: 'Clib' },
      { id: 'su5', name: 'Harada Butai' }, { id: 'su6', name: 'Katipunan' }, { id: 'su7', name: 'Kiblagon' }, { id: 'su8', name: 'Labon' },
      { id: 'su9', name: 'Laperas' }, { id: 'su10', name: 'Lapla' }, { id: 'su11', name: 'Litos' }, { id: 'su12', name: 'Luparan' },
      { id: 'su13', name: 'Mckinley' }, { id: 'su14', name: 'New Cebu' }, { id: 'su15', name: 'Osmeña' }, { id: 'su16', name: 'Palili' },
      { id: 'su17', name: 'Parame' }, { id: 'su18', name: 'Poblacion' }, { id: 'su19', name: 'Roxas' }, { id: 'su20', name: 'Solongvale' },
      { id: 'su21', name: 'Tagolilong' }, { id: 'su22', name: 'Tala-o' }, { id: 'su23', name: 'Talas' }, { id: 'su24', name: 'Tanwalang' },
      { id: 'su25', name: 'Waterfall' }
    ]
  }
};
