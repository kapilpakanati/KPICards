import React, { useState,useEffect } from 'react';
import { Card, Skeleton, Space, Image,Typography,Row,Col,Progress,Divider,Tooltip,Button } from 'antd';
import { PlusOutlined} from '@ant-design/icons';
import kpi from '../Images/KPI.png'
import { ReactComponent as EmptyState} from  '../Images/emptystate.svg'
import positive from '../Images/positive.png'
import negative from '../Images/negative.png'
import edit from '../Images/edit.png'
import checkin from '../Images/checkin.png'
import trend from '../Images/trend.png'
import linkedobj from '../Images/linkedobj.png'
import '../index.css';
const { Meta } = Card;
const { Title,Text } = Typography;
var kf;
var page_id ;
var my_email ;
var application_id;
var account_id;
var role_name ;
var tab_name;
var team_name;
var column_instance_id
var val_instance_id;
var kpi_count;



const KPICardComponent = () => {
 
  var save_kpi_refresh ;
  var team_okr_tab_change_kpi;
  let kf = window.kf;
  page_id = kf.app.page._id;
  console.log("page_id",page_id)
my_email = kf.user.Email;
console.log("my_email",my_email)
application_id = kf.app._id;
console.log("application_id",application_id)
account_id = kf.account._id;
console.log("account_id",account_id)
role_name = kf.user.Role.Name;
console.log("role_name",role_name)

  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [count, setKPIcount] = useState(0);
  
  const [loading, setLoading] = useState(true);

  const [col_actual, setcol_actual] = useState();
  const [col_target, setcol_target] = useState();
  const [col_KPI_Owner, setcol_KPI_Owner] = useState();
  const [col_KPI_Name, setcol_KPI_Name] = useState();
  const [col_id, setcol_id] = useState();

  const [col_KPI_high_is_good, setcol_KPI_high_is_good] = useState("");
  const [col_linked_obj, setcol_linked_obj] = useState("");
  const [col_Difference_1, setcol_Difference_1] = useState("");
  const [col_Difference, setcol_Difference] = useState("");
  const [col_KPI_owner_emailid, setcol_KPI_owner_emailid] = useState("");
  const [col_Team_Name, setcol_Team_Name] = useState("");
  const [col_KPI_Owner_email, setcol_KPI_Owner_email] = useState("");
  const [col_created_by_email, setcol_created_by_email] = useState("");
  const [col_KPI_Owner_email_id, setcol_KPI_Owner_email_id] = useState("");
  const [col_KPI_Metrics, setcol_KPI_Metrics] = useState("");
  const [col_Current_Value, setcol_Current_Value] = useState("");
  
  
 

  useEffect(() => {
    kf.context.watchParams(async function (watch) {
       save_kpi_refresh = watch.save_kpi_refresh;
      console.log("REACT status wise progress", save_kpi_refresh);    
      let team_okr_tab_change = watch.team_okr_tab_change_kpi;
      console.log("team_okr_tab_change",team_okr_tab_change_kpi)
    fetchData();    
    });


}, []);


async function fetchData() {
      
        let application_id = kf.app._id;
  var account_id = kf.account._id;
  var kpi_company_report_id = await kf.app.getVariable("kpi_company_report_id");
  let kpi_data_form_id = await kf.app.getVariable("kpi_data_form_id");
  let kpi_report_id = await kf.app.getVariable("kpi_report_id");
  let kpi_teamwise_report_id = await kf.app.getVariable("kpi_teamwise_report_id");
  var kpi_dataform_name = "KPI Master";
  var kpi_report_name = "All items";
  var kpi_teamwise_report_name = "Team-Wise KPI Master";
  var kpi_company_name = "Company KPIs";
  var my_email =  kf.user.Email; 

  console.log("inside fetchData");
    

  if (!kpi_data_form_id) {
    await kf.api("/flow/2/" + account_id + "/form/?_application_id=" + application_id).then(async (form_report) => {
      console.log('process data', form_report);
      let data_form_info = form_report.find(itm => itm.Name === kpi_dataform_name);
      kpi_data_form_id = data_form_info._id;
      console.log("dataform name", kpi_dataform_name);
      console.log("dataform id =", kpi_data_form_id);
    });
    kf.app.setVariable("kpi_data_form_id", kpi_data_form_id);

  }

  if (!kpi_report_id || !kpi_teamwise_report_id || kpi_company_report_id) {
    await kf.api("/flow/2/" + account_id + "/form/" + kpi_data_form_id + "/report?_application_id=" + application_id).then((report_list) => {
      if (!kpi_report_id) {
        let report_info = report_list.find(itm => itm.Name === kpi_report_name);
        kpi_report_id = report_info._id;
        console.log("report_info =", kpi_report_id);
        kf.app.setVariable("kpi_report_id", kpi_report_id);
      }
  
      if (!kpi_teamwise_report_id) {
        let report_info = report_list.find(itm => itm.Name === kpi_teamwise_report_name);
        kpi_teamwise_report_id = report_info._id;
        console.log("report_info =", kpi_teamwise_report_id);
        kf.app.setVariable("kpi_teamwise_report_id", kpi_teamwise_report_id);
      }

      if (!kpi_company_report_id) {
        let report_info = report_list.find(itm => itm.Name === kpi_company_name);
        kpi_company_report_id = report_info._id;
        console.log("report_info =", kpi_company_report_id);
        kf.app.setVariable("kpi_company_report_id", kpi_company_report_id);
      }
    });
  }
  

     
    let url="";
    try {
    if (page_id == "role_executive_api_customisation_A00") {
        url = "/form-report/2/" + account_id + "/" + kpi_data_form_id + "/" + kpi_report_id + "?_application_id=" + application_id + "&$kpi_owner_emailid=" + my_email + "&page_number=1&page_size=1000";
      console.log("url", url)
    }
  
    else if (page_id == "Copy_Team_OKR_Page_A00") {

      let team_okr_current_tab = await kf.app.getVariable("Team_OKR_Team_Name")
      console.log("team_okr_current_tab",team_okr_current_tab)
          url = "/form-report/2/" + account_id + "/" + kpi_data_form_id + "/" + kpi_teamwise_report_id + "?_application_id=" + application_id + "&$team_name=" + team_okr_current_tab + "&page_number=1&page_size=1000";
      console.log("url", url)
    }
  
    else if (page_id == "Company_OKR_page_A00") {
          url = "/form-report/2/" + account_id + "/" + kpi_data_form_id + "/" + kpi_company_report_id + "?_application_id=" + application_id + "&page_number=1&page_size=1000";
      console.log("url", url)  
    }

    const result = await kf.api(url);
    if (result.Data) {
       kpi_count = result.Data.length;
      let kpi_data = result.Data;
      console.log("result.data", kpi_data);
      setItems(kpi_data);
      setKPIcount(kpi_count);
    } else {
      // Handle the case when result.Data is null or undefined
      // For example, you can set default values or show an error message.
      console.error("result.Data is null or undefined");
      // You can set default values or handle the error as needed.
    }
  
  
    for (let j in result.Columns) {
      let colval = result.Columns[j];
      console.log("Columns", colval)  
      if (colval.FieldId == "Actual_display") {
        setcol_actual(colval.Id);
        column_instance_id = colval.Id
        console.log('column_values',column_instance_id);
      }
  
      else if (colval.FieldId == "Target_display_1") {
        setcol_target (colval.Id);
      }
  
      else if (colval.FieldId == "KPI_Owner_filtered") {
        setcol_KPI_Owner(colval.Id);
      }
  
      else if (colval.FieldId == "KPI") {
        setcol_KPI_Name (colval.Id);
        console.log("col_KPI_Name", col_KPI_Name) 
      }
  
      else if (colval.FieldId == "id_1") {
        setcol_id (colval.Id);
        val_instance_id = colval.Id
        console.log('val_instance_id on page load',val_instance_id);
      }
  
      else if (colval.FieldId == "KPI_value__High_is_good_") {
        setcol_KPI_high_is_good(colval.Id);
      }
  
      else if (colval.FieldId == "Total_Number_of_Objectives_1") {
        setcol_linked_obj(colval.Id);
      }
  
      else if (colval.FieldId == "Difference_for_progress_bar") {
        setcol_Difference_1(colval.Id);
      }
  
      else if (colval.FieldId == "Difference") {
        setcol_Difference (colval.Id);
      }
  
      else if (colval.FieldId == "KPI_Owner_filtered") {
        setcol_KPI_owner_emailid (colval.Id);
      }
  
      else if (colval.FieldId == "Team_Name") {
        setcol_Team_Name (colval.Id);
      }
  
      else if (colval.FieldId == "KPI_Owner_filtered") {
        setcol_KPI_Owner_email (colval.Id);
      }
  
      else if (colval.FieldId == "Created_By_id") {
        setcol_created_by_email (colval.Id);
      }
  
      else if (colval.FieldId == "KPI_owner_emailid") {
        setcol_KPI_Owner_email_id(colval.Id);
      }
      else if (colval.FieldId == "KPI_Metrics") {
        setcol_KPI_Metrics(colval.Id);
      }
      else if (colval.FieldId == "Actual_for_Progress_bar") {
        setcol_Current_Value(colval.Id);
      }
      

    }
    

    
    
    setLoading(false);
    console.log("setLoading sets");  
    console.log("data set t:", items);  
    }
     catch (error) {
        console.log(error);
    setLoading(false);
    setError(error);
  }
}



// console.log("col_id kapil", col_id);
// fetchData();
  
//}, []);




 async function addnewkpi () {

  let kf = window.kf;
  var kpi_company_report_id = await kf.app.getVariable("kpi_company_report_id");
 
  let kpi_report_id = await kf.app.getVariable("kpi_report_id");
  let kpi_teamwise_report_id = await kf.app.getVariable("kpi_teamwise_report_id");
  
  let kpi_data_form_id = await kf.app.getVariable("kpi_data_form_id");
  var kpi_dataform_name = "KPI Master";


  if (!kpi_data_form_id) {
    await kf.api("/flow/2/" + account_id + "/form/?_application_id=" + application_id).then(async (form_report) => {
      console.log('process data', form_report);
      var data_form_info = form_report.find(itm => itm.Name === kpi_dataform_name);
      kpi_data_form_id = data_form_info._id;
      console.log("dataform name", kpi_dataform_name);
      console.log("dataform id =", kpi_data_form_id);
    });
    kf.app.setVariable("kpi_data_form_id", kpi_data_form_id);

  }




if(page_id == "Company_OKR_page_A00")
  {
console.log("CLICKED")
const response = kf.api("/form/2/"+kf.account._id+"/"+kpi_data_form_id, {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({"Actual_in_":0,"Is_Actual_to_be_visible_":"No","Is_this_Company_KPI_" : "Yes","Company_KPI_Owner_Email":kf.user.Email})
});

let instance_id = response._id
kf.app.page.openPopup("Popup_LqDhqy1-1", {instance_id});

} 

// else if(page_id == "role_executive_api_customisation_A00")
//   {
// console.log("CLICKED")
// const response = kf.api("/form/2/"+kf.account._id+"/KPI_Master_A00", {
//   method: "POST",
//   headers: {"Content-Type": "application/json"},
//   body: JSON.stringify({"Actual_in_":0,"Is_Actual_to_be_visible_":"No","Is_this_Company_KPI_" : "No"})
// });

// let instance_id = response._id
// kf.app.page.openPopup("Popup_LqDhqy1-1", {instance_id});

// }
else if(page_id == "Copy_Team_OKR_Page_A00")
  {


    let account_id = kf.account._id;

    kf.app.getVariable("Team_OKR_Team_Name")
      .then(TEAM_NAME => {
        console.log(TEAM_NAME);
    
        return kf.api("/form/2/" + account_id + "/"+kpi_data_form_id, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "Is_Actual_to_be_visible_": "No", "Team_Name_4": TEAM_NAME })
        });
      })
      .then(response => {
        let instance_id_kpi = response._id;
        kf.app.page.openPopup("Popup_LqDhqy1-1", { instance_id_kpi });
      })
      .catch(error => {
        console.error(error);
      });
    

}
 


}




async function handleEditClick (e) {
  
  console.log("Edit button clicked for item with ID:", e.target.id);
  let kf = window.kf;
  let kpi_data_form_id = await kf.app.getVariable("kpi_data_form_id");
  var kpi_dataform_name = "KPI Master";


  if (!kpi_data_form_id) {
    await kf.api("/flow/2/" + account_id + "/form/?_application_id=" + application_id).then(async (form_report) => {
      console.log('process data', form_report);
      let data_form_info = form_report.find(itm => itm.Name === kpi_dataform_name);
      kpi_data_form_id = data_form_info._id;
      console.log("dataform name", kpi_dataform_name);
      console.log("dataform id =", kpi_data_form_id);
    });
    kf.app.setVariable("kpi_data_form_id", kpi_data_form_id);

  }


  console.log("Card clicked!", e.target.id);
//   if(role_name != "Employee" )

// {
  if(page_id == "Copy_Team_OKR_Page_A00")
  {

    const response =  kf.api("/form/2/"+account_id+"/"+kpi_data_form_id, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"Name":e.target.id,"Is_Actual_to_be_visible_":"Yes","check_in_visibility" : "No"})
    });
  kf.app.page.openPopup("Popup_Ow73cTTTZ", { "instance_id_kpi": e.target.id});
  } 

  else if(page_id == "role_executive_api_customisation_A00")
  {

    const response =  kf.api("/form/2/"+account_id+"/"+kpi_data_form_id, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"Name":e.target.id,"Is_Actual_to_be_visible_":"Yes","check_in_visibility" : "No"})
    });
  kf.app.page.openPopup("Popup_LqDhqy1-1", { "instance_id_kpi": e.target.id});
  }

  else if(page_id == "Company_OKR_page_A00")
  {

    const response =  kf.api("/form/2/"+account_id+"/"+kpi_data_form_id, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"Name":e.target.id,"Is_Actual_to_be_visible_":"Yes","check_in_visibility" : "No"})
    });
  kf.app.page.openPopup("Popup_LqDhqy1-1", { "instance_id_kpi": e.target.id});
  }
// }

// else if (role_name == "Employee"){
//   console.log("Card clicked!", e.target.id);
//   kf.app.page.openPopup("Popup_LqDhqy1-1", { "instance_id_kpi": e.target.id });
// };

};


async function handleCheckinClick   (e) {

  console.log("Edit button clicked for item with ID:", e.target.id);
  let kf = window.kf;
  let kpi_data_form_id = await kf.app.getVariable("kpi_data_form_id");
  var kpi_dataform_name = "KPI Master";


  if (!kpi_data_form_id) {
    await kf.api("/flow/2/" + account_id + "/form/?_application_id=" + application_id).then(async (form_report) => {
      console.log('process data', form_report);
      let data_form_info = form_report.find(itm => itm.Name === kpi_dataform_name);
      kpi_data_form_id = data_form_info._id;
      console.log("dataform name", kpi_dataform_name);
      console.log("dataform id =", kpi_data_form_id);
    });
    kf.app.setVariable("kpi_data_form_id", kpi_data_form_id);

  }

  

  console.log("Check button clicked for item with instance ID:", e.target.id);

  console.log("Check-in Card clicked!", e.target.id);
//   if(role_name != "Employee" )

// {
  if(page_id == "Copy_Team_OKR_Page_A00")
  {
console.log("insideloop",e.target.id)
    const response =  kf.api("/form/2/"+account_id+"/KPI_Master_A00", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"Name":e.target.id,"Is_Actual_to_be_visible_":"Yes","check_in_visibility" : "Yes"})
    });
  kf.app.page.openPopup("Popup_LqDhqy1-1", { "instance_id_kpi": e.target.id});
  } 

 else if(page_id == "role_executive_api_customisation_A00")
  {

    const response =  kf.api("/form/2/"+account_id+"/KPI_Master_A00", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"Name":e.target.id,"Is_Actual_to_be_visible_":"Yes","check_in_visibility" : "Yes"})
    });
  kf.app.page.openPopup("Popup_LqDhqy1-1", { "instance_id_kpi": e.target.id});
  }


else  if(page_id == "Company_OKR_page_A00")
  {

    const response =  kf.api("/form/2/"+account_id+"/KPI_Master_A00", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"Name":e.target.id,"Is_Actual_to_be_visible_":"Yes","check_in_visibility" : "Yes"})
    });
  kf.app.page.openPopup("Popup_LqDhqy1-1", { "instance_id_kpi": e.target.id});
  }
// }

// else if (role_name == "Employee"){
//   console.log("Card clicked!", e.target.id);
//   kf.app.page.openPopup("Popup_LqDhqy1-1", { "instance_id_kpi": e.target.id });
// };


};

async function handletrendClick   (e) {
if(page_id == "role_executive_api_customisation_A00")
{
  kf.app.page.openPopup("Popup_DN8jbAEze", { "instance_id": e.target.id});
  kf.app.page.openPopup("Popup_dxbJcMlLR", { "instance_id": e.target.id});
  
}
  else  if(page_id == "Copy_Team_OKR_Page_A00")
  {
    kf.app.page.openPopup("Popup_W8BKO3udw", { "instance_id": e.target.id});
    kf.app.page.openPopup("Popup_HyWGDyshH", { "instance_id": e.target.id});
    console.log("e.target.id",e.target.id)
    
  }
  else  if(page_id == "Company_OKR_page_A00")
  
  {
    kf.app.page.openPopup("Popup_S1XnUWcrs", { "instance_id": e.target.id});
    kf.app.page.openPopup("Popup_yqbeMGAtS", { "instance_id": e.target.id});
    
  }

};

 
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (loading) {
    return (
        <>
         <Space>
     &nbsp;<Image preview = {false} src={kpi} height={16} width={16}></Image>
     <Title level={5} style={{fontFamily:"Inter",marginTop:"50%"}}>KPI</Title></Space>
     <br/><br/>
        <Card style={{width: '93%', marginLeft: '5%', borderColor:"#D8DCE5",borderRadius:"8px"}}>
        <Skeleton loading={loading}  active shape="square">
         <Space direction='vertical' align='end'>
          <Meta  style={{fontFamily:"Inter"}}         
            title="test"
            description={<><Image src={positive} height={8} width={12}></Image>&nbsp;&nbsp;
            <Text style={{fontSize:"13px",fontWeight:"400",color:"#A1A3A8"}}>12% from last check-in</Text></>}
          />
          </Space>
           
          <Row>
          <Col span={12} align="left"><Text style={{fontSize:"13px",fontWeight:"600",color:"black"}}>122 123</Text></Col>
          <Col span={12} align="right"><Text style={{fontSize:"13px",fontWeight:"400",color:"#A1A3A8"}}>Target: 500M</Text></Col>
          </Row>
          <Progress percent={50} showInfo={false}   />
          <Divider />
          <Row>
          <Col span={12} align="left">
          <Tooltip title="linked Objectives"><Button  style={{background:"#EEF5FF",borderRadius:"18px"}} type="link"    >
          <Image preview={false}  width={15} height={15}  src={linkedobj}/>&nbsp;&nbsp;
          <Text style={{fontSize:"13px",fontWeight:"400",color:"#0565FF"}}>{3}</Text></Button></Tooltip>
          </Col>
          <Col span={12} align="right"><Tooltip title="Check in"><Button type="link"  shape="circle"  >
       <Image preview={false}  width={35} height={30}  src={checkin}/></Button></Tooltip>
       &nbsp;
       <Tooltip  title="Edit"><Button    type="link"  shape="circle"  >
       <Image preview={false} width={35} height={30}  src={edit}/></Button></Tooltip></Col>
          </Row>
        </Skeleton>    
         
      </Card>  
       <Card style={{width: '90%', marginLeft: '5%', borderColor:"#D8DCE5",borderRadius:"8px"}}>
       <Skeleton loading={loading}  active shape="square">
        <Space direction='vertical' align='end'>
         <Meta  style={{fontFamily:"Inter"}}         
           title="test"
           description={<><Image src={positive} height={8} width={12}></Image>&nbsp;&nbsp;
           <Text style={{fontSize:"13px",fontWeight:"400",color:"#A1A3A8"}}>12% from last check-in</Text></>}
         />
         </Space>
          
         <Row>
         <Col span={12} align="left"><Text style={{fontSize:"13px",fontWeight:"600",color:"black"}}>122 123</Text></Col>
         <Col span={12} align="right"><Text style={{fontSize:"13px",fontWeight:"400",color:"#A1A3A8"}}>Target: 500M</Text></Col>
         </Row>
         <Progress percent={50} showInfo={false}   />
         <Divider />
         <Row>
         <Col span={12} align="left">
         <Tooltip title="linked Objectives"><Button  style={{background:"#EEF5FF",borderRadius:"18px"}} type="link"    >
         <Image preview={false}  width={15} height={15}  src={linkedobj}/>&nbsp;&nbsp;
         <Text style={{fontSize:"13px",fontWeight:"400",color:"#0565FF"}}>{3}</Text></Button></Tooltip>
         </Col>
         <Col span={12} align="right"><Tooltip title="Check in"><Button type="link"  shape="circle"  >
      <Image preview={false}  width={35} height={30}  src={checkin}/></Button></Tooltip>
      &nbsp;
      <Tooltip  title="Edit"><Button    type="link"  shape="circle"  >
      <Image preview={false} width={35} height={30}  src={edit}/></Button></Tooltip></Col>
         </Row>
       </Skeleton>    
        
     </Card> 
      <Card style={{width: '90%', marginLeft: '5%', borderColor:"#D8DCE5",borderRadius:"8px"}}>
      <Skeleton loading={loading}  active shape="square">
       <Space direction='vertical' align='end'>
        <Meta  style={{fontFamily:"Inter"}}         
          title="test"
          description={<><Image src={positive} height={8} width={12}></Image>&nbsp;&nbsp;
          <Text style={{fontSize:"13px",fontWeight:"400",color:"#A1A3A8"}}>12% from last check-in</Text></>}
        />
        </Space>
         
        <Row>
        <Col span={12} align="left"><Text style={{fontSize:"13px",fontWeight:"600",color:"black"}}>122 123</Text></Col>
        <Col span={12} align="right"><Text style={{fontSize:"13px",fontWeight:"400",color:"#A1A3A8"}}>Target: 500M</Text></Col>
        </Row>
        <Progress percent={50} showInfo={false}   />
        <Divider />
        <Row>
        <Col span={12} align="left">
        <Tooltip title="linked Objectives"><Button  style={{background:"#EEF5FF",borderRadius:"18px"}} type="link"    >
        <Image preview={false}  width={15} height={15}  src={linkedobj}/>&nbsp;&nbsp;
        <Text style={{fontSize:"13px",fontWeight:"400",color:"#0565FF"}}>{3}</Text></Button></Tooltip>
        </Col>
        <Col span={12} align="right"><Tooltip title="Check in"><Button type="link"  shape="circle"  >
     <Image preview={false}  width={35} height={30}  src={checkin}/></Button></Tooltip>
     &nbsp;
     <Tooltip  title="Edit"><Button    type="link"  shape="circle"  >
     <Image preview={false} width={35} height={30}  src={edit}/></Button></Tooltip>
     </Col>
        </Row>
      </Skeleton>    
       
    </Card> 
    </>

    );
    

  } else if (kpi_count > 0) {
  return (
    <>
   
      
     <Row>
      <Col span={12} align="left">
      <Space>   <Image  preview = {false}  src={kpi} height={16} width={16}></Image>
     <Title level={5} style={{fontFamily:"Inter",marginTop:"13%"}}>KPI <span style={{color:"gray",fontSize:"12px"}}>({count} items)</span></Title>
     </Space></Col>
     {page_id !== "role_executive_api_customisation_A00" && role_name !== "Employee" && (
     <Col span={12} align="right"> 
     <Button  size="small" type="primary" icon={<PlusOutlined />} onClick={addnewkpi}  style={{ marginTop: "20px"}}>
    Add KPI
  </Button></Col>
)}
</Row>
     <br/><br/>

     {console.log(items)}
     {console.log(col_KPI_Name)}

       

            {items.map((item) =>
        <Card style={{width: '93%', marginLeft: '5%', borderColor:"#D8DCE5",borderRadius:"8px"}}>
        <Skeleton loading={loading}  active shape="square">
          
         <Row>
         <Col align="left">
         <Text style={{width:"300px",fontFamily:"Inter",fontSize:"15px",fontWeight:"600"}}
ellipsis={
    
      {
          tooltip: item[col_KPI_Name],
        }
      
  }
  
      >
        {item[col_KPI_Name]}
      </Text></Col>
          </Row>
          <Row>
      <Col align="left">
      {(() => {
        if (item[col_Difference]=="Positive") {
          return <><Image preview={false} src={positive} height={8} width={12}></Image>&nbsp;&nbsp;
          <Text style={{fontSize:"13px",fontWeight:"400",color:"#A1A3A8"}}>{item[col_Difference_1]+"%"} from last check-in</Text></>;
        } else if (item[col_Difference]=="Negative") {
          return <><Image preview={false}  src={negative} height={8} width={12}></Image>&nbsp;&nbsp;
          <Text style={{fontSize:"13px",fontWeight:"400",color:"#A1A3A8"}}>{item[col_Difference_1]+"%"} from last check-in</Text></>;
        }
      })()}
      </Col>
          </Row>
          <br/>
           
          <Row>
          <Col span={12} align="left"><Text style={{fontSize:"13px",fontWeight:"400",color:"#A1A3A8"}}>Actual: <Text style={{fontSize:"13px",fontWeight:"600"}}>{item[col_actual]}</Text> </Text>
          {(() => {
        if (item[col_KPI_Metrics]!="Percentage") {

            return <Text style={{fontSize:"13px",fontWeight:"400",color:"#A1A3A8"}}><Text style={{fontSize:"13px",fontWeight:"600"}}>{"("+item[col_actual]+"%)"}</Text>  </Text>;
            
        }})()}
            </Col>
          <Col span={12} align="right"><Text style={{fontSize:"13px",fontWeight:"400",color:"#A1A3A8"}}>Target: <Text style={{fontSize:"13px",fontWeight:"600"}}>{item[col_target]}</Text></Text></Col>
          </Row>
          <br/>
          {/* <Progress percent={item[col_Current_Value]} showInfo={false}   />
          <Divider /> */}
          <Row>
          <Col span={12} align="left">
          <Tooltip title="linked Objectives"><Button  style={{background:"#EEF5FF",borderRadius:"18px"}} type="link"    >
          <Image preview={false}  width={15} height={15}  src={linkedobj}/>&nbsp;&nbsp;
          <Text style={{fontSize:"13px",fontWeight:"400",color:"#0565FF"}}>{item[col_linked_obj]}</Text></Button></Tooltip>
          </Col>
          {console.log("kpiowneremail",item[col_KPI_Owner_email_id])}
          {console.log("createdbyemail",item[col_created_by_email])}
          {item[col_KPI_Owner_email_id] == my_email && (
  <Col span={12} align="right" style={{ display: "flex", marginLeft : "-25px"}}>
     <Tooltip title="KPI Trend">
      <Button
        id={item[col_id]}
        type="link"
        onClick={(e) => handletrendClick(e)}
        style={{ background: "#EEF5FF", borderRadius: "18px",marginRight: "2px"}}
      >
        <img
          width={15}
          height={15}
          src={trend}
          style={{ margin: "3px", pointerEvents: "none" }}
        />
      </Button>
    </Tooltip>
    <Tooltip title="Check in">
      <Button
        id={item[col_id]}
        type="link"
        onClick={(e) => handleCheckinClick(e)}
        style={{ background: "#EEF5FF", borderRadius: "18px" }}
      >
        <img
          width={15}
          height={15}
          src={checkin}
          style={{ margin: "3px", pointerEvents: "none" }}
        />
      </Button>
    </Tooltip>
    &nbsp;
    <Tooltip title="Edit">
      <Button
        id={item[col_id]}
        onClick={(e) => handleEditClick(e)}
        type="link"
        style={{ background: "#EEF5FF", borderRadius: "18px" }}
      >
        <img
          width={15}
          height={15}
          src={edit}
          style={{ margin: "3px", pointerEvents: "none" }}
        />
      </Button>
    </Tooltip>
  </Col>
)}

          </Row>
        </Skeleton>    
         
      </Card>  
   
          
      )

   
      
      
      
      
      
      }



 
</>    

   

          
      
      
        
  ) ;} else if (kpi_count <= 0) {
    return (
      
 
   
<>
  <Row>
      <Col span={12} align="left">
      <Space>   <Image  preview = {false}  src={kpi} height={16} width={16}></Image>
     <Title level={5} style={{fontFamily:"Inter",marginTop:"45%"}}>KPI</Title>
     </Space></Col>
     {page_id !== "role_executive_api_customisation_A00" && (
     <Col span={12} align="right"> 
     <Button size="small"  type="primary" icon={<PlusOutlined />} onClick={addnewkpi}  style={{ marginTop: "20px",marginRight: "10px"}}>
    Add KPI
  </Button></Col>
)}
</Row>
<br/>
<br/>
    <Row>
  <Col span={24} align="center">
     
      <EmptyState height="160" width="160" />
     
  </Col>
  </Row>
   
  <Col span={24} align="center">
  
  <p style={{ fontFamily:"Inter",fontWeight:"600",color:"black",fontSize:"16px"}}>No KPIs Assigned to You</p>
  </Col>
  <Col span={24} align="center">
  
 <p style={{ fontFamily:"Inter",fontWeight:"400",color:"#545C6B",fontSize:"13px"}}>It looks like no KPIs have been assigned to you yet. 📊</p>
 </Col>
  </>


    )


};}

export { KPICardComponent};