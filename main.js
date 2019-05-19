function simulation() {
	
	//--------------------------------------------------------------------------//
	//---------------------------------Classes----------------------------------//
	//--------------------------------------------------------------------------//
	function Compo_flotte(techno_arme, techno_bouclier, techno_protection) {
		this.pt = null;
		this.gt = null;
		this.cle = null;
		this.clo = null;
		this.cro = null;
		this.vb = null;
		this.vc = null;
		this.cyclo = null;
		this.sonde = null;
		this.sat = null;
		this.bb = null;
		this.dd = null;
		this.rip = null;
		this.traq = null;
		this.techno_arme = techno_arme;
		this.techno_bouclier = techno_bouclier;
		this.techno_protection = techno_protection;
		this.total = 0;
	};

	function Vaisseau(nbr, type, arme, bouclier, coque) {
		this.nbr = nbr;
		this.type = type;
		this.arme = arme;
		this.bouclier = bouclier;
		this.coque = coque;
		this.bouclier_initial = bouclier;
		this.coque_initial = coque;
		this.bouclier_total = bouclier *nbr;
		this.coque_total = coque *nbr;
	};

	function verification(x) {			// on s'assure que les valeur sont bien des entiers
		if (x === "") {
			var result = 0;
		} else if (x === undefined) {
			var result = 0;
		} else {
			var result = parseInt(x);
		}
		return result;
	};

	function insert(total, qui) {				// on parametres chaques vaisseau
		var type = new Array("pt", "gt", "cle", "clo", "cro", "vb", "vc", "cyclo", "sonde", "sat", "bb", "dd", "rip", "traq"),
			arme = new Array(5, 5, 50, 150, 400, 1000, 50, 1, 0.01, 1000, 1, 2000, 200000, 700),
			bouclier = new Array(10, 25, 10, 25, 50, 200, 200, 20, 0, 500, 1, 500, 50000, 400),
			protection = new Array(4000, 12000, 4000, 10000, 27000, 60000, 30000, 16000, 1000, 75000, 2000, 110000, 9000000, 70000),
			limite = 0,
			tot = 0;
		for (var i = 0; i <= 13; i++) {
			total[type[i]] = new Vaisseau(verification(document.getElementById('ship_'+qui+'_'+i+'_b').value),
					type[i],
					total.techno_arme *(arme[i]) +arme[i],
					total.techno_bouclier *(bouclier[i]) +bouclier[i],
					total.techno_protection *(protection[i]/10) +protection[i]
				);
			tot = tot +parseInt(total[type[i]].nbr);
		}
		total.total = tot;
		return total;
	};

	function recharge_bouclier(total) {			// on recharge les boucliers à chaque tour
		var type = new Array("pt", "gt", "cle", "clo", "cro", "vb", "vc", "cyclo", "sonde", "sat", "bb", "dd", "rip", "traq");
		for (var i = 0; i < 13; i++) {
			total[type[i]].bouclier = total[type[i]].bouclier_initial;
		}
		return total;
	};

	function dommages(predateur, proie) {		// on attaque le bouclier, et la coque si c'est possible
		if (predateur.arme < (proie.bouclier /100)) {
			// -- on ne fait rien
		} else {
			if ((predateur.arme *predateur.nbr) < proie.bouclier_total) {
				proie.bouclier_total = proie.bouclier_total - (predateur.arme *predateur.nbr);
			} else {
				proie.coque_total = proie.coque_total - ((predateur.arme *predateur.nbr) - proie.bouclier_total);
				proie.bouclier_total = 0;				
			}
			if (proie.coque_total < 1) {
				proie.coque = -1;
			} else {}
		}
		return proie;
	};

	function proba_destruction(proie, proba) {		// si le vaisseau est trop endommagé il a une chance d'exploser
		var random = Math.floor(Math.random() * (100));
		if (random > proba) {
			proie.coque = -1;
		} else {}
		return proie;
	};

	function rapidfire(predateur, proie) {//, nbr) {		// on calcul si il y a ou pas RF
		var type = new Array("pt", "gt", "cle", "clo", "cro", "vb", "vc", "cyclo", "sonde", "sat", "bb", "dd", "rip", "traq"),
			proba = RapidFire[type.indexOf(predateur)][type.indexOf(proie)],
			random = Math.floor(Math.random() * (100));
		if (proba < 0) {    // || nbr > 200) {
			var result = false;
		} else if (random < proba) {
			var result = true;
		} else {
			var result = false;
		}
		return result;
	};

	function combat(predateur, proie) {			// chaque vaisseau attaque un vaisseau aléatoirement
		var type = new Array("pt", "gt", "cle", "clo", "cro", "vb", "vc", "cyclo", "sonde", "sat", "bb", "dd", "rip", "traq"),
			liste_defenseur = new Array(),
			diff_proie = 0;

		for (var i = 0; i <= 13; i++) {
			if (proie[type[i]].nbr > 0) {
				diff_proie++;
				liste_defenseur.push(i);
			} else {}
		}

		for (var i = 0; i <= 13; i++) {
			if (predateur[type[i]].nbr > 0) {
				do {
					var id_proie = Math.floor(Math.random() *(diff_proie)); 			// selection de la cible aléatoire
					proie[type[liste_defenseur[id_proie]]] = dommages(predateur[type[i]], proie[type[liste_defenseur[id_proie]]]);
					if (proie[type[liste_defenseur[id_proie]]].coque_total < (proie[type[liste_defenseur[id_proie]]].coque *proie[type[liste_defenseur[id_proie]]].nbr) *0.7) {
						proie[type[liste_defenseur[id_proie]]] = proba_destruction(proie[type[liste_defenseur[id_proie]]], ((proie[type[liste_defenseur[id_proie]]].coque_total *100) / (proie[type[liste_defenseur[id_proie]]].coque *proie[type[liste_defenseur[id_proie]]].nbr)));
					} else {}
				} while(rapidfire(predateur[type[i]].type, proie[type[liste_defenseur[id_proie]]].type) && proie[type[liste_defenseur[id_proie]]].coque_total > 0);
			} else {}
		}
		return proie;
	};

	function suppression_vaisso(total) {		// on supprime un vaisseau si li est détruit
		var type = new Array("pt", "gt", "cle", "clo", "cro", "vb", "vc", "cyclo", "sonde", "sat", "bb", "dd", "rip", "traq");
		for (var i = 0; i <= 13; i++) {
			if (total[type[i]].nbr > 0) {
				if (total[type[i]].coque === -1) {
					total[type[i]].nbr--;
					total[type[i]].bouclier_total = total[type[i]].bouclier *total[type[i]].nbr;
					total[type[i]].coque_total = total[type[i]].coque *total[type[i]].nbr;
					total.total--;
					i--;
				} else {
					if (total[type[i]].coque_total < (total[type[i]].coque *total[type[i]].nbr)) {
						var sert_a_tout = (total[type[i]].coque *total[type[i]].nbr) - total[type[i]].coque_total;
						sert_a_tout = sert_a_tout / total[type[i]].coque;
						if (sert_a_tout >= 1) {
							sert_a_tout = Math.floor(sert_a_tout);
							total[type[i]].nbr = total[type[i]].nbr - sert_a_tout;
							total.total = total.total - sert_a_tout;
							total[type[i]].bouclier_total = total[type[i]].bouclier *total[type[i]].nbr;
							total[type[i]].coque_total = total[type[i]].coque *total[type[i]].nbr;
							i--;
						} else {}
					} else {}
				}
			} else {}
			
		}
		return total;
	};

	function resultat(total_att, total_def, tour) {
		var type = new Array("pt", "gt", "cle", "clo", "cro", "vb", "vc", "cyclo", "sonde", "sat", "bb", "dd", "rip", "traq");
		for (var i = 0; i <= 13; i++) {
			if (total_att[type[i]].nbr >= 0 && document.getElementById('ship_a_'+i+'_b').value != "") {
				document.getElementById('ship_a_'+i+'_e').textContent = total_att[type[i]].nbr;
			} else if (total_att[type[i]].nbr == 0 && document.getElementById('ship_a_'+i+'_b').value == "") {
				document.getElementById('ship_a_'+i+'_e').textContent = "";
			} else {}
			if (total_def[type[i]].nbr >= 0 && document.getElementById('ship_d_'+i+'_b').value != "") {
				document.getElementById('ship_d_'+i+'_e').textContent = total_def[type[i]].nbr;
			} else if (total_def[type[i]].nbr == 0 && document.getElementById('ship_d_'+i+'_b').value == "") {
				document.getElementById('ship_d_'+i+'_e').textContent = "";
			} else {}
		}
		if (total_att.total <= 0) {
			document.getElementById("qui_gagne").innerText = "Defenseur Gagne a 100%";
		} else if (total_def.total <= 0) {
			document.getElementById("qui_gagne").innerText = "Attaquant Gagne a 100%";
		} else {
			document.getElementById("qui_gagne").innerText = "Egalite";
		}
		document.getElementById("nbr_tour").innerText = "Nombre de tours: "+tour;
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
		resultat_tours = new Array(),
		resultat_moyenne = new Array(),
		RapidFire = new Array(),
		RapidFire_limite = new Array();
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
	RapidFire_limite = [
        /*					   pt  gt cle clo cro  vb  vc  etc...
        /*               PT */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
        /*               GT */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
        /*               Cl */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
        /*               CL */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
        /*               CR */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, 90, -1, -1, -1, -1, -1, -1, -1*/],
        /*               VB */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
        /*               VC */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
        /*               RC */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
        /*               SE */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
        /*               BB */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, 95, 95, 90, 90, -1, -1, -1, -1*/],
        /*               SS */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, -1, -1, -1, -1, -1, -1, -1*/],
        /*               DS */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, 90, -1, -1, -1, -1, -1, -1*/],
        /*               EM */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, 99.5, 99.5, 99, 99, 98, -1, -1, -1*/],
        /*               BC */[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1/*, -1, 90, -1, -1, -1, -1, -1, -1*/],
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
	var attaquant = new Compo_flotte(verification(document.getElementsByName("tech_a_0")[0].value),
			verification(document.getElementsByName("tech_a_1")[0].value),
			verification(document.getElementsByName("tech_a_2")[0].value)
		),
		defenseur = new Compo_flotte(verification(document.getElementsByName("tech_d_0")[0].value),
			verification(document.getElementsByName("tech_d_1")[0].value),
			verification(document.getElementsByName("tech_d_2")[0].value)
		);

	attaquant = insert(attaquant, "a");		//	# intégralité, valeurs initial/origine
	defenseur = insert(defenseur, "d");		//	# intégralité, valeurs initial/origine

	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//




	//--------------------------------------------------------------------------//
	//-------------------------------Simulation---------------------------------//
	//--------------------------------------------------------------------------//


	for (var i = 0; i < 20; i++) {
		var attaquant_tours = attaquant,
			defenseur_tours = defenseur;
		resultat_tours = new Array();
		while (tour < 6 && attaquant_tours.total !== 0 && defenseur_tours.total !== 0) {
			attaquant_tours = recharge_bouclier(attaquant_tours);
			defenseur_tours = recharge_bouclier(defenseur_tours);
			//console.log("1");

			//-------	ATTAQUANT
			defenseur_tours = combat(attaquant_tours, defenseur_tours);
			//console.log("2");

			//-------	DEFENSEUR
			attaquant_tours = combat(defenseur_tours, attaquant_tours);
			//console.log("3");

			
			attaquant_tours = suppression_vaisso(attaquant_tours);
			//console.log("4");
			defenseur_tours = suppression_vaisso(defenseur_tours);
			//console.log("5");
			tour++;
		}
		resultat_tours[i].push(attaquant_tours);
		resultat_tours[i].push(defenseur_tours);
	}
		
	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//
	//--------------------------------------------------------------------------//


resultat(attaquant_tours, defenseur_tours, tour);
console.log("Tours: "+tour);
console.log("Attaquant: "+attaquant_tours.total, "Defenseur: "+defenseur_tours.total);

console.log(attaquant_tours);
console.log(defenseur_tours);






























}