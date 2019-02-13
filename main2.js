function simulation() {
	
	//--------------------------------------------------------------------------//
	//---------------------------------Classes----------------------------------//
	//--------------------------------------------------------------------------//
	function Attaquant(pt, gt, cle, clo, cro, vb, vc, cyclo, sonde, bb, dd, rip, traq, techno_arme, techno_bouclier, techno_protection) {
		this.pt = pt;
		this.gt = gt;
		this.cle = cle;
		this.clo = clo;
		this.cro = cro;
		this.vb = vb;
		this.vc = vc;
		this.cyclo = cyclo;
		this.sonde = sonde;
		this.sat = 0;
		this.bb = bb;
		this.dd = dd;
		this.rip = rip;
		this.traq = traq;
		this.techno_arme = techno_arme;
		this.techno_bouclier = techno_bouclier;
		this.techno_protection = techno_protection;
		this.flotte = null;
		this.total = pt+gt+cle+clo+cro+vb+vc+cyclo+sonde+bb+dd+rip+traq;
	};

	function Defenseur(pt, gt, cle, clo, cro, vb, vc, cyclo, sonde, sat, bb, dd, rip, traq, techno_arme, techno_bouclier, techno_protection) {
		this.pt = pt;
		this.gt = gt;
		this.cle = cle;
		this.clo = clo;
		this.cro = cro;
		this.vb = vb;
		this.vc = vc;
		this.cyclo = cyclo;
		this.sonde = sonde;
		this.bb = bb;
		this.sat = sat;
		this.dd = dd;
		this.rip = rip;
		this.traq = traq;
		this.techno_arme = techno_arme;
		this.techno_bouclier = techno_bouclier;
		this.techno_protection = techno_protection;
		this.flotte = null;
		this.total = pt+gt+cle+clo+cro+vb+vc+cyclo+sonde+sat+bb+dd+rip+traq;
	};

	function Vaisseau(type, arme, bouclier, protection) {
		this.type = type;
		this.arme = arme;
		this.bouclier = bouclier;
		this.protection = protection;
		this.bouclier_initial = bouclier;
		this.protection_initial = protection;
	};

	function verification(x) {
		if (x === "") {
			var result = 0;
		} else if (x === undefined) {
			var result = 0;
		} else {
			var result = parseInt(x);
		}
		return result;
	};

	function insert(total, tablo) {
		var type = new Array("pt", "gt", "cle", "clo", "cro", "vb", "vc", "cyclo", "sonde", "sat", "bb", "dd", "rip", "traq"),
			arme = new Array(5, 5, 50, 150, 400, 1000, 50, 1, 0.01, 1000, 1, 2000, 200000, 700),
			bouclier = new Array(10, 25, 10, 25, 50, 200, 200, 20, 0, 500, 1, 500, 50000, 400),
			protection = new Array(4000, 12000, 4000, 10000, 27000, 60000, 30000, 16000, 1000, 75000, 2000, 110000, 9000000, 70000),
			limite = 0;
		for (var i = 0; i < 14; i++) {
			limite = tablo.length + total[type[i]];
			for (var o = tablo.length; o < limite; o++) {
				tablo[o] = new Vaisseau(type[i],
						total.techno_arme *(arme[i]/10) +arme[i],
						total.techno_bouclier *(bouclier[i]/10) +bouclier[i],
						total.techno_protection *(protection[i]/10) +protection[i]
					);
			}
		}
		total.flotte = tablo;
		return total;
	};

	function recharge_bouclier(total) {
		var tablo = total.flotte;
		for (var i = 0; i < total.total; i++) {
			tablo[i].bouclier = tablo[i].bouclier_initial;
		}
		total.flotte = tablo;
		return total;
	};

	function dommages(predateur, proie) {
		if (predateur.arme < (proie.bouclier /100)) {
			// -- on ne fait rien
		} else {
			if (predateur.arme < proie.bouclier) {
				proie.bouclier = proie.bouclier - predateur.arme;
			} else {
				proie.protection = proie.protection - (predateur.arme - proie.bouclier);
				proie.bouclier = 0;				
			}
			if (proie.protection < 1) {
				proie.protection = -1;
			} else {}
		}
		return proie;
	};

	function proba_destruction(proie, proba) {
		var random = Math.floor(Math.random() * (100));
		if (random > proba) {
			proie.protection = -1;
		} else {}
		return proie;
	};

	function rapidfire(predateur, proie, nbr) {
		var type = new Array("pt", "gt", "cle", "clo", "cro", "vb", "vc", "cyclo", "sonde", "sat", "bb", "dd", "rip", "traq"),
			proba = RapidFire[type.indexOf(predateur.type)][type.indexOf(proie.type)],
			random = Math.floor(Math.random() * (100));
		if (proba < 0 || nbr > 200) {
			var result = "non";
		} else if (random < proba) {
			var result = "oui";
		} else {
			var result = "non";
		}
		return result;
	};

	function combat(predateur, proie) {
		var tablo_predateur = predateur.flotte,
			tablo_proie = proie.flotte,
			result = 0;

		for (var i = 0; i < predateur.total; i++) {
			var id_proie = Math.floor(Math.random() * (proie.total)); 			// selection de la cible aléatoire
			tablo_proie[id_proie] = dommages(tablo_predateur[i], tablo_proie[id_proie]);
			if (tablo_proie[id_proie].protection < (tablo_proie[id_proie].protection_initial) *0.7) {
				tablo_proie[id_proie] = proba_destruction(tablo_proie[id_proie], ((tablo_proie[id_proie].protection *100) / tablo_proie[id_proie].protection_initial));
			} else {}

		}
		proie.flotte = tablo_proie;
		return proie;
	};

	function suppression_vaisso(total) {
		var tablo = total.flotte;
		for (var i = 0; i < total.total; i++) {
			if (tablo[i].protection === -1) {
				tablo.splice(i, 1);
				total.total--;
				i--;
			} else {}
		}
		total.flotte = tablo;
		return total;
	};
	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//


	//--------------------------------------------------------------------------//
	//------------------------------Initialisation------------------------------//
	//--------------------------------------------------------------------------//
	var detail_attaquant = new Array(),
		detail_defenseur = new Array(),
		tour = 0,
		RapidFire = new Array();
		RapidFire = [
	        /*					   pt  gt cle clo cro  vb  vc  etc...
	        /*               PT */[-1, -1, -1, -1, -1, -1, -1, -1, 80, -1, 80, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
	        /*               GT */[-1, -1, -1, -1, -1, -1, -1, -1, 80, -1, 80, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
	        /*               Cl */[-1, -1, -1, -1, -1, -1, -1, -1, 80, -1, 80, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
	        /*               CL */[-1, -1, -1, -1, -1, -1, -1, -1, 80, -1, 80, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
	        /*               CR */[-1, -1, 83.33, -1, -1, -1, -1, -1, 80, -1, 80, -1, -1, -1/*, 90, -1, -1, -1, -1, -1, -1, -1*/],
	        /*               VB */[-1, -1, -1, -1, -1, -1, -1, -1, 80, -1, 80, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
	        /*               VC */[-1, -1, -1, -1, -1, -1, -1, -1, 80, -1, 80, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
	        /*               RC */[-1, -1, -1, -1, -1, -1, -1, -1, 80, -1, 80, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
	        /*               SE */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
	        /*               BB */[-1, -1, -1, -1, -1, -1, -1, -1, 80, -1, 80, -1, -1, -1/*, 95, 95, 90, 90, -1, -1, -1, -1*/],
	        /*               SS */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
	        /*               DS */[-1, -1, -1, -1, -1, -1, -1, -1, 80, -1, 80, -1, -1, 50/*, -1, 90, -1, -1, -1, -1, -1, -1*/],
	        /*               EM */[99.6, 99.6, 99.5, 99, 96.97, 99.667, 99.6, 99.6, 99.6, 96, 99.6, 80, 0, 93.333/*, 99.5, 99.5, 99, 99, 98, -1, -1, -1*/],
	        /*               BC */[66.667, 66.667, -1, 75, 75, 85.7, -1, -1, 80, 80, -1, -1, -1, -1/*, -1, 90, -1, -1, -1, -1, -1, -1*/],
	        /*               LM   [-1, -1, -1, -1, -1, -1, -1, -1, 80, 80, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	        /*               Ll   [-1, -1, -1, -1, -1, -1, -1, -1, 80, 80, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	        /*               LL   [-1, -1, -1, -1, -1, -1, -1, -1, 80, 80, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	        /*               AI   [-1, -1, -1, -1, -1, -1, -1, -1, 80, 80, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	        /*               CG   [-1, -1, -1, -1, -1, -1, -1, -1, 80, 80, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	        /*               LP   [-1, -1, -1, -1, -1, -1, -1, -1, 80, 80, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	        /*               PB   [-1, -1, -1, -1, -1, -1, -1, -1, 80, 80, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	        /*               GB   [-1, -1, -1, -1, -1, -1, -1, -1, 80, 80, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]*/
		];

	
	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//




	//--------------------------------------------------------------------------//
	//-------------------------------Récupération-------------------------------//
	//--------------------------------------------------------------------------//
	var attaquant = new Attaquant(verification(document.getElementById('ship_a_0_b').value),
			verification(document.getElementById('ship_a_1_b').value),
			verification(document.getElementById('ship_a_2_b').value),
			verification(document.getElementById('ship_a_3_b').value),
			verification(document.getElementById('ship_a_4_b').value),
			verification(document.getElementById('ship_a_5_b').value),
			verification(document.getElementById('ship_a_6_b').value),
			verification(document.getElementById('ship_a_7_b').value),
			verification(document.getElementById('ship_a_8_b').value),
			verification(document.getElementById('ship_a_9_b').value),
			//--
			verification(document.getElementById('ship_a_11_b').value),
			verification(document.getElementById('ship_a_12_b').value),
			verification(document.getElementById('ship_a_13_b').value),

			verification(document.getElementsByName("tech_a_0")[0].value),
			verification(document.getElementsByName("tech_a_1")[0].value),
			verification(document.getElementsByName("tech_a_2")[0].value)
		),
		defenseur = new Defenseur(verification(document.getElementById('ship_d_0_b').value),
			verification(document.getElementById('ship_d_1_b').value),
			verification(document.getElementById('ship_d_2_b').value),
			verification(document.getElementById('ship_d_3_b').value),
			verification(document.getElementById('ship_d_4_b').value),
			verification(document.getElementById('ship_d_5_b').value),
			verification(document.getElementById('ship_d_6_b').value),
			verification(document.getElementById('ship_d_7_b').value),
			verification(document.getElementById('ship_d_8_b').value),
			verification(document.getElementById('ship_d_9_b').value),
			verification(document.getElementById('ship_d_10_b').value),
			verification(document.getElementById('ship_d_11_b').value),
			verification(document.getElementById('ship_d_12_b').value),
			verification(document.getElementById('ship_d_13_b').value),

			verification(document.getElementsByName("tech_d_0")[0].value),
			verification(document.getElementsByName("tech_d_1")[0].value),
			verification(document.getElementsByName("tech_d_2")[0].value)
		);

	attaquant = insert(attaquant, detail_attaquant);
	defenseur = insert(defenseur, detail_defenseur);

	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//




	//--------------------------------------------------------------------------//
	//-------------------------------Simulation---------------------------------//
	//--------------------------------------------------------------------------//
	while (tour < 6 && attaquant.total !== 0 && defenseur.total !== 0) {
		attaquant = recharge_bouclier(attaquant);
		defenseur = recharge_bouclier(defenseur);
		//console.log("1");

		//-------	ATTAQUANT
		defenseur = combat(attaquant, defenseur);
		//console.log("2");

		//-------	DEFENSEUR
		attaquant = combat(defenseur, attaquant);
		//console.log("3");

		
		attaquant = suppression_vaisso(attaquant);
		//console.log("4");
		defenseur = suppression_vaisso(defenseur);
		//console.log("5");
		tour++;
	}
	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//


console.log("Tours: "+tour);

console.log(attaquant);
console.log(defenseur);






























}