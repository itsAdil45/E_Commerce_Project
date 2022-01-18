class ApiFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(){
    const keyword = this.queryStr.keyword ? {
        name:{
            $regex: this.queryStr.keyword,
            $options: "i"
        }
    }:{};

    this.query = this.query.find({...keyword});
    return this;

  }

  filter(){
    const copyQuery ={...this.queryStr}
    const removeValues = ["keywor", "page" , "limit"];
    removeValues.forEach((key)=>delete copyQuery[key])
    this.query = this.query.find(copyQuery);
    return this;
}

}

module.exports=ApiFeature;