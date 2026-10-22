export interface DistrictData {
  name: string;
  upazilas: string[];
}

export interface DivisionData {
  name: string;
  districts: Record<string, string[]>;
}

export const BANGLADESH_GEO_DATA: Record<string, DivisionData> = {
  Dhaka: {
    name: 'Dhaka',
    districts: {
      Dhaka: [
        'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur',
        'Badda', 'Tejgaon', 'Motijheel', 'Khilkhet', 'Pallabi', 'Basundhara',
        'Savar', 'Keraniganj', 'Dhamrai', 'Nawabganj', 'Dohar'
      ],
      Gazipur: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Sreepur', 'Kapasia', 'Kaliganj'],
      Narayanganj: ['Narayanganj Sadar', 'Bandar', 'Fatullah', 'Siddhirganj', 'Rupganj', 'Araihazar', 'Sonargaon'],
      Narsingdi: ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Belabo', 'Monohardi', 'Raipura'],
      Tangail: ['Tangail Sadar', 'Mirzapur', 'Delduar', 'Ghatail', 'Kalihati', 'Madhupur', 'Gopalpur', 'Sakhipur'],
      Kishoreganj: ['Kishoreganj Sadar', 'Bhairab', 'Bajitpur', 'Hossainpur', 'Katiadi', 'Karimganj', 'Pakundia'],
      Manikganj: ['Manikganj Sadar', 'Singair', 'Saturia', 'Shibalaya', 'Ghior', 'Harirampur'],
      Munshiganj: ['Munshiganj Sadar', 'Sreenagar', 'Sirajdikhan', 'Louhajang', 'Tongibari', 'Gazaria'],
      Faridpur: ['Faridpur Sadar', 'Bhanga', 'Boalmari', 'Madhukhali', 'Nagarkanda', 'Sadarpur'],
      Gopalganj: ['Gopalganj Sadar', 'Tungipara', 'Kashiani', 'Kotalipara', 'Muksudpur'],
      Madaripur: ['Madaripur Sadar', 'Shibchar', 'Kalkini', 'Rajoir'],
      Rajbari: ['Rajbari Sadar', 'Goalanda', 'Pangsha', 'Baliakandi'],
      Shariatpur: ['Shariatpur Sadar', 'Naria', 'Jajira', 'Bhedarganj', 'Damudya']
    }
  },
  Chittagong: {
    name: 'Chittagong',
    districts: {
      Chittagong: [
        'Kotwali', 'Panchlaish', 'Chandgaon', 'Pahartali', 'Double Mooring', 'Halishahar',
        'Patenga', 'Hathazari', 'Sitakunda', 'Mirsharai', 'Patiya', 'Boalkhali', 'Anwara',
        'Raozan', 'Rangunia', 'Fatikchhari', 'Satkania', 'Lohagara', 'Banshkhali'
      ],
      "Cox's Bazar": ["Cox's Bazar Sadar", 'Ramu', 'Chakaria', 'Pekua', 'Teknaf', 'Ukhia', 'Maheshkhali'],
      Comilla: ['Comilla Adarsha Sadar', 'Comilla Sadar Dakshin', 'Daudkandi', 'Chandina', 'Muradnagar', 'Debidwar', 'Burichang', 'Laksam', 'Chauddagram'],
      Feni: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Sonagazi', 'Parshuram', 'Fulgazi'],
      Brahmanbaria: ['Brahmanbaria Sadar', 'Kasba', 'Akhaura', 'Ashuganj', 'Nabinagar', 'Bancharampur', 'Sarail'],
      Noakhali: ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Senbagh', 'Sonaimuri'],
      Chandpur: ['Chandpur Sadar', 'Faridganj', 'Hajiganj', 'Matlab Dakshin', 'Matlab Uttar', 'Shahrasti'],
      Lakshmipur: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'],
      Khagrachhari: ['Khagrachhari Sadar', 'Dighinala', 'Panchhari', 'Matiranga', 'Ramgarh'],
      Rangamati: ['Rangamati Sadar', 'Kaptai', 'Kawkhali', 'Baghaichhari', 'Langadu'],
      Bandarban: ['Bandarban Sadar', 'Ruma', 'Thanchi', 'Lama', 'Alikadam', 'Naikhongchhari']
    }
  },
  Rajshahi: {
    name: 'Rajshahi',
    districts: {
      Rajshahi: ['Boalia', 'Motihar', 'Rajputra', 'Godagari', 'Tanore', 'Mohanpur', 'Bagmara', 'Puthia', 'Charghat', 'Paba'],
      Bogra: ['Bogra Sadar', 'Shibganj', 'Sherpur', 'Gabtali', 'Sariakandi', 'Dhunat', 'Kahaloo', 'Adamdighi', 'Dupchanchia'],
      Pabna: ['Pabna Sadar', 'Ishwardi', 'Atgharia', 'Bera', 'Chatmohar', 'Faridpur', 'Santhia', 'Sujanagar'],
      Sirajganj: ['Sirajganj Sadar', 'Ullahpara', 'Shahjadpur', 'Kazipur', 'Raiganj', 'Belkuchi', 'Tarash', 'Kamarkhanda'],
      Naogaon: ['Naogaon Sadar', 'Mohadevpur', 'Manda', 'Niamatpur', 'Atrai', 'Raninagar', 'Patnitala', 'Dhamoirhat'],
      Natore: ['Natore Sadar', 'Singra', 'Baraigram', 'Bagatipara', 'Lalpur', 'Gurudaspur'],
      Chapainawabganj: ['Chapainawabganj Sadar', 'Shibganj', 'Gomastapur', 'Nachole', 'Bholahat'],
      Joypurhat: ['Joypurhat Sadar', 'Panchbibi', 'Kalai', 'Khetlal', 'Akkelpur']
    }
  },
  Khulna: {
    name: 'Khulna',
    districts: {
      Khulna: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Dumuria', 'Batiaghata', 'Dacope', 'Paikgachha', 'Rupsha', 'Phultala'],
      Jessore: ['Jessore Sadar', 'Jhikargachha', 'Sharsha', 'Manirampur', 'Keshabpur', 'Bagherpara', 'Abhaynagar', 'Chaugachha'],
      Kushtia: ['Kushtia Sadar', 'Kumarkhali', 'Khoksa', 'Mirpur', 'Bheramara', 'Daulatpur'],
      Satkhira: ['Satkhira Sadar', 'Kalaroa', 'Tala', 'Debhata', 'Kaliganj', 'Assasuni', 'Shyamnagar'],
      Jhenaidah: ['Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa', 'Harinakunda'],
      Bagerhat: ['Bagerhat Sadar', 'Mongla', 'Rampal', 'Morrelganj', 'Fakirhat', 'Kachua', 'Chitalmari'],
      Chuadanga: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar'],
      Meherpur: ['Meherpur Sadar', 'Gangni', 'Mujibnagar'],
      Magura: ['Magura Sadar', 'Sreepur', 'Mohammadpur', 'Shalikha'],
      Narail: ['Narail Sadar', 'Lohagara', 'Kalia']
    }
  },
  Barisal: {
    name: 'Barisal',
    districts: {
      Barisal: ['Barisal Sadar', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur', 'Agailjhara'],
      Patuakhali: ['Patuakhali Sadar', 'Bauphal', 'Galachipa', 'Dashmina', 'Kalapara', 'Mirzaganj', 'Dumki', 'Rangabali'],
      Bhola: ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'],
      Pirojpur: ['Pirojpur Sadar', 'Bhandaria', 'Mathbaria', 'Nazirpur', 'Nesarabad', 'Kawkhali'],
      Barguna: ['Barguna Sadar', 'Amtali', 'Betagi', 'Bamna', 'Patharghata', 'Taltali'],
      Jhalokati: ['Jhalokati Sadar', 'Kathalia', 'Nalchity', 'Rajapur']
    }
  },
  Sylhet: {
    name: 'Sylhet',
    districts: {
      Sylhet: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Companiganj', 'Fenchuganj', 'Balaganj', 'Biswanath', 'Gowainghat', 'Jaintiapur', 'Dakshin Surma', 'Osmani Nagar'],
      Moulvibazar: ['Moulvibazar Sadar', 'Sreemangal', 'Kamalganj', 'Kulaura', 'Barlekha', 'Juri', 'Rajnagar'],
      Habiganj: ['Habiganj Sadar', 'Nabiganj', 'Bahubal', 'Madhabpur', 'Chunarughat', 'Lakhai', 'Baniachong'],
      Sunamganj: ['Sunamganj Sadar', 'Chhatak', 'Jagannathpur', 'Derai', 'Dharmapasha', 'Dowarabazar', 'Tahirpur', 'Shantiganj']
    }
  },
  Rangpur: {
    name: 'Rangpur',
    districts: {
      Rangpur: ['Rangpur Sadar', 'Badarganj', 'Mithapukur', 'Pirganj', 'Kaunia', 'Gangachhara', 'Taraganj', 'Pirgachha'],
      Dinajpur: ['Dinajpur Sadar', 'Birganj', 'Bochaganj', 'Kaharole', 'Chirirbandar', 'Phulbari', 'Parbatipur', 'Birampur', 'Biral'],
      Kurigram: ['Kurigram Sadar', 'Nageshwari', 'Bhurungamari', 'Phulbari', 'Rajarhat', 'Ulipur', 'Chilmari', 'Rowmari'],
      Gaibandha: ['Gaibandha Sadar', 'Gobindaganj', 'Sundarganj', 'Sadullapur', 'Saghata', 'Palashbari'],
      Nilphamari: ['Nilphamari Sadar', 'Saidpur', 'Domar', 'Dimla', 'Jaldhaka', 'Kishoreganj'],
      Lalmonirhat: ['Lalmonirhat Sadar', 'Aditmari', 'Kaliganj', 'Hatibandha', 'Patgram'],
      Panchagarh: ['Panchagarh Sadar', 'Boda', 'Debiganj', 'Tetulia', 'Atwari'],
      Thakurgaon: ['Thakurgaon Sadar', 'Pirganj', 'Ranisankail', 'Haripur', 'Baliadangi']
    }
  },
  Mymensingh: {
    name: 'Mymensingh',
    districts: {
      Mymensingh: ['Mymensingh Sadar', 'Muktagachha', 'Bhaluka', 'Trishal', 'Fulbaria', 'Gaffargaon', 'Haluaghat', 'Ishwarganj', 'Phulpur', 'Tara Khanda'],
      Jamalpur: ['Jamalpur Sadar', 'Melandaha', 'Islampur', 'Dewanganj', 'Sarishabari', 'Madarganj', 'Bakshiganj'],
      Netrokona: ['Netrokona Sadar', 'Kendua', 'Mohanganj', 'Barhatta', 'Purgadhala', 'Atpara', 'Kalmakanda', 'Durgapur'],
      Sherpur: ['Sherpur Sadar', 'Nakla', 'Nalitabari', 'Jhenaigati', 'Sreebardi']
    }
  }
};
