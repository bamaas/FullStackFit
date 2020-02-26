  // activitylevelFactor: number = null;
  // goalFactor: number = null;
  // calculateBMR(){
  //   // Get & Set variables
  //   var name = this.tdee_calculator_form.controls['name'].value
  //   var gender: string = this.tdee_calculator_form.controls['gender'].value
  //   var weight = this.tdee_calculator_form.controls['weight'].value
  //   var length = this.tdee_calculator_form.controls['length'].value
  //   var age = this.tdee_calculator_form.controls['age'].value
  //   // console.log(gender)
  //   // console.log(age)
  //   // console.log(length)
  //   // console.log(name)
    
  //   // push to dictionary fot endpoint
  //   this.userDetails['name'] = name;
  //   this.userDetails['gender'] = gender;
  //   this.userDetails['length'] = length;
  //   this.userDetails['weight'] = weight;
  //   this.userDetails['age'] = age;
  // }

  // calculate_tdee(){
  //   this.calculateBMR()
  //   // this.calculate_macros()
  //   this.results = true;

  //   // Push to endpoint
  //   this.userDetails['activitylevel'] = this.activitylevel
  //   this.userDetails['goal'] = this.goal
  //   console.log(this.userDetails)
  //   this.postjson(this.userDetails)
  // }

  // // Calculate macronutrient requirements
  // calculate_proteinReq(){
  //   this.proteinReqGram = Math.round(this.tdee_calculator_form.controls['weight'].value * 2)
  //   this.proteinReqKcal = Math.round(this.proteinReqGram * 4)
  //   this.proteinReqPrc = Math.round(100 * this.proteinReqKcal / this.tdee)
  // }

  // calculate_fatReq(){
  //   this.fatReqGram = Math.round(this.tdee_calculator_form.controls['weight'].value * 1)
  //   this.fatReqKcal = Math.round(this.fatReqGram * 9)
  //   this.fatReqPrc = Math.round(100 * this.fatReqKcal / this.tdee)
  // }

  // calculate_carbReq(){
  //   this.carbReqKcal = Math.round(this.tdee - (this.proteinReqKcal + this.fatReqKcal))
  //   this.carbReqGram = Math.round(this.carbReqKcal / 4)
  //   this.carbReqPrc = Math.round(100 * this.carbReqKcal / this.tdee)
  // }

  // calculate_macros(){
  //   this.calculate_proteinReq()
  //   this.calculate_fatReq()
  //   this.calculate_carbReq()
  //   this.dataSource = [
  //     {name: 'Protein', gram: this.proteinReqGram, kcal: this.proteinReqKcal, percentage:this.proteinReqPrc},
  //     {name: 'Carbohydrates', gram: this.carbReqGram, kcal: this.carbReqKcal, percentage: this.carbReqPrc},
  //     {name: 'Fat', gram: this.fatReqGram, kcal: this.fatReqKcal, percentage: this.fatReqPrc},
  //   ];
  // }