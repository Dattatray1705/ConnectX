import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
// import { resetPostId } from "@/config/redux/action/postAction";
import { createPost } from "@/config/redux/action/postAction";
export default function ProfilePage() {

const [editMode, setEditMode] = useState(false);

    const router = useRouter();
      const dispatch = useDispatch();
        const authState = useSelector((state) => state.auth);
const posts = useSelector((state) => state.posts.posts || []);


const filteredPosts = posts.filter((post) => {
  console.log("POST USER =", post.userId);

  const postUserId =
    typeof post.userId === "object"
      ? post.userId?._id
      : post.userId;

  return postUserId?.toString() ===
    authState?.profile?.userId?._id?.toString();
});

useEffect(() => {
  console.log("PROFILE ID =", authState?.profile?.userId?._id);

  posts.forEach((post) => {
    console.log("POST =", post);
  });
}, [posts]);


useEffect(() => {
  console.log("POSTS CHANGED =", posts?.length);
}, [posts]);
const [userProfile,setUserProfile] = useState({
  userId:{
    name:"",
    username:"",
    email:"",
    profilePicture:""
  },
  bio:"",
  pastWork:[]
})

const[isModalOpen ,setIsModalOpen] = useState(false);
const [inputData,setInputData] =useState({company:'',position:'',years:''})
const [isPostModalOpen,setIsPostModalOpen] = useState(false);
const [postInput,setPostInput] = useState({body:"",file:null});
const [isEducationModalOpen,setIsEducationModalOpen] = useState(false);
const [educationInput,setEducationInput] = useState({
  school:"",
  degree:"",
  fieldOfStudy:""
});
const [coverImage, setCoverImage] = useState("");
const handleWorkInputChange = (e)=>{
const{name ,value}=e.target;
setInputData({...inputData,[name]:value});
}

const handlePostChange = (e)=>{
 const {name,value} = e.target;
 setPostInput({...postInput,[name]:value});
};
const handleFileChange = (e)=>{
 setPostInput({...postInput,file:e.target.files[0]});
};
const handleEducationInputChange = (e)=>{
  const {name,value} = e.target;

  setEducationInput({
    ...educationInput,
    [name]:value
  });
};

const addPostToProfile = async () => {
  const result = await dispatch(
    createPost({
      body: postInput.body,
      file: postInput.file,
    })
  );

  console.log("RESULT =", result);
  console.log("PAYLOAD =", result.payload);

  
if (createPost.fulfilled.match(result)) {
  await dispatch(getAllPosts());
  await dispatch(getAboutUser());
}

  setPostInput({
    body: "",
    file: null,
  });

  setIsPostModalOpen(false);
};




useEffect(()=>{
if(authState?.profile){



setUserProfile(authState.profile)
}

},[authState.profile])


 const uploadProfilePicture = async (file) => {
   console.log("UPLOAD START");
  try {

    const formData = new FormData();

    formData.append("profile_picture", file);
  

    const response = await clientServer.post(
      "/api/users/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("SUCCESS =", response.data);

 dispatch(getAboutUser());

  } catch (error) {

    console.log("STATUS =", error.response?.status);
    console.log("DATA =", error.response?.data);
    console.log("ERROR =", error);

  }
};

 useEffect(() => {
  dispatch(getAllPosts());
}, [dispatch]);

const updateProfileData = async()=>{
   const responce1 = await clientServer.post("/api/users/user_update",{
   
    name:userProfile?.userId?.name,
   });
 const responce2 = await clientServer.post("/api/users/update_profile_data",{
 
     bio: userProfile?.bio,
     currentPost:userProfile?.currentPost,
     pastWork:userProfile?.pastWork,
     education:userProfile?.education
 });
dispatch(getAboutUser());
}


const uploadCoverImage = async (file) => {
  const formData = new FormData();

  formData.append("cover_image", file);


  try {
    await clientServer.post(
      "/api/users/update_cover_image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

 dispatch(getAboutUser());
  } catch (error) {
    console.log(error);
  }
};
//delete work
const handleDeleteWork = async (index) => {
  const updatedWork = userProfile.pastWork.filter(
    (_, i) => i !== index
  );

  setUserProfile({
    ...userProfile,
    pastWork: updatedWork,
  });

  await clientServer.post("/api/users/update_profile_data", {
    
    pastWork: updatedWork,
    education: userProfile.education,
    bio: userProfile.bio,
  });

  dispatch(getAboutUser());
};
//eduacation

const handleDeleteEducation = async (index) => {
  const updatedEducation = userProfile.education.filter(
    (_, i) => i !== index
  );

  setUserProfile({
    ...userProfile,
    education: updatedEducation,
  });

  await clientServer.post("/api/users/update_profile_data", {

    pastWork: userProfile.pastWork,
    education: updatedEducation,
    bio: userProfile.bio,
  });

  dispatch(getAboutUser());
};

//delete  post
const handleDeletePost = async (postId) => {
  try {
    await clientServer.delete("/api/posts/delete_post", {
      data: {
        post_id: postId,
      },
    });

    dispatch(getAllPosts());
  } catch (error) {
    console.log(error);
  }
};

const handleDownloadResume = async () => {
  try {

    const response = await clientServer.get(
      `/api/users/user/download_profile?id=${userProfile.userId._id}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob(
      [response.data],
      { type: "application/pdf" }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "Resume.pdf";

    document.body.appendChild(link);
    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.log(error);
  }
};


  return (
    <UserLayout>
        <DashboardLayout>
            {authState.profile && (
      <div className={styles.container}>

{/* COVER */}
<div
  className={styles.backDropContainer}
  style={{
   backgroundImage: userProfile?.userId?.coverImage
  ? `url("${userProfile.userId.coverImage}")`
      : "url('/cover.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
    {editMode && (
  <>
    <label
    style={{textAlign:"center", opacity:"1"}}
      htmlFor="coverImage"
      className={styles.coverButton}
    >
      +
    </label>

 <input
  hidden
  type="file"
  id="coverImage"
  onChange={(e) => {
    const file = e.target.files[0];

    if (file) {
      setCoverImage(URL.createObjectURL(file));
      uploadCoverImage(file); 
    }
  }}
/>
  </>
)}

 {editMode && (
  <>
  
    <label htmlFor="uploadProfilePicture" className={styles.overlay}>
      <p>Edit</p>
    </label>

    <input
      onChange={(e)=>{
        uploadProfilePicture(e.target.files[0])
      }}
      hidden
      type="file"
      id="uploadProfilePicture"
    />
  </>
)}
    <img
  src={userProfile?.userId?.profilePicture || "/default.jpg"}
  alt="profile"
/>


</div>

{/* PROFILE DETAILS */}

<div className={styles.profileContainer_details}>

<div className={styles.profileTopSection}>
<div style={{flex:"0.8"}}>
<div style={{display:"flex",gap:"1rem",width:"fit-content",alignItems:"center"}}>
{editMode ? (
  <input
    type="text"
    className={styles.nameEdit}
    value={userProfile?.userId?.name}
    onChange={(e) =>
      setUserProfile({
        ...userProfile,
        userId: {
          ...userProfile.userId,
          name: e.target.value,
        },
      })
    }
  />
) : (
  <h1 className={styles.nameEdit}>
    {userProfile?.userId?.name}
  </h1>
)}
<p style={{color:"grey"}}>
@{userProfile?.userId?.username}
</p>
</div>

<div>
  {editMode ? (
    <textarea
    style={{
    background: "white",
    padding: "10px",
    borderRadius: "8px"
  }}
      className={styles.bioEdit}
      value={userProfile?.bio || ""}
      onChange={(e) =>
        setUserProfile({
          ...userProfile,
          bio: e.target.value,
        })
      }
    />
  ) : (
    <p  style={{
    marginTop: "10px",
    marginBottom:"20px",
    background: "white",
    padding: "10px",
    borderRadius: "8px",
    width:"25rem"
  }}>
      <b>Bio :</b> {userProfile?.bio || "Add Bio"}
    </p>
  )}
</div>

</div>
</div>
{/* POSTS */}

{/* RECENT ACTIVITY */}

<div className={styles.workHistory}>

<h4>Recent Post</h4>

<div className={styles.workHistoryConatainer}>

{filteredPosts?.map((post,index)=>(
   
<div
  key={index}
  className={styles.workHistoryCard}
  style={{ position: "relative" }}
>
  {editMode && (
    <span
      className={styles.crossBtn}
      onClick={() => handleDeletePost(post._id)}
    >
      ✖
    </span>
  )}

{post.media && (
  post.fileType?.startsWith("video") ? (
    <video
      controls
      style={{
        width: "100%",
        marginBottom: "10px",
        borderRadius: "10px"
      }}
    >
      <source src={post.media} type={post.fileType} />
    </video>
  ) : (
    <img
      src={post.media}
      alt="post"
      style={{
        width: "100%",
        marginBottom: "10px",
        borderRadius: "10px"
      }}
    />
  )
)}

  <p>{post.body}</p>
</div>
))}

{editMode && (
  <button 
    className={styles.addWorkButton}
    onClick={() => setIsPostModalOpen(true)}
  >
    Add Post
  </button>
)}

</div>

</div>

</div>

{/* WORK HISTORY */}

<div className={styles.workHistory}>

<h4>Work History</h4>

<div className={styles.workHistoryConatainer}>

{userProfile?.pastWork?.map((work,index)=>(
<div
  key={index}
  className={styles.workHistoryCard}
  style={{ position: "relative" }}
>
  {editMode && (
    <span
      className={styles.crossBtn}
      onClick={() => handleDeleteWork(index)}
    >
      ✖
    </span>
  )}

  <p style={{ fontWeight: "bold" }}>
    {work.company} - {work.position}
  </p>

  <p>
    <b>Experience :</b> {work.years}
  </p>
</div>
))}
{editMode && (
  <button
    className={styles.addWorkButton}
    onClick={() => setIsModalOpen(true)}
  >
    Add Work
  </button>
)}
</div>

</div>


<div className={styles.workHistory}>

<h4>Education</h4>

<div className={styles.workHistoryConatainer}>

{userProfile?.education?.map((edu,index)=>(
<div
  key={index}
  className={styles.workHistoryCard}
  style={{ position: "relative" }}
>
  {editMode && (
    <span
      className={styles.crossBtn}
      onClick={() => handleDeleteEducation(index)}
    >
      ✖
    </span>
  )}

  <p style={{ fontWeight: "bold" }}>
    {edu.school}
  </p>

  <p>{edu.degree}</p>

  <p>{edu.fieldOfStudy}</p>
</div>
))}

{editMode && (
  <button
    className={styles.addWorkButton}
    onClick={() => setIsEducationModalOpen(true)}
  >
    Add Education
  </button>
)}

</div>

</div>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px"
  }}
>
  <button
  className={styles.upadateNameButton}
  onClick={handleDownloadResume}
>
  Download Resume
</button>
  {!editMode ? (
    <button
      className={styles.upadateNameButton}
      onClick={() => setEditMode(true)}
    >
      Edit Profile
    </button>
  ) : (
    <>
      <button
        className={styles.upadateNameButton}
        onClick={async () => {
          await updateProfileData();
          setEditMode(false);
        }}
      >
        Save Changes
      </button>

      <button
        className={styles.addWorkButton}
        onClick={() => setEditMode(false)}
      >
        Cancel
      </button>
    </>
  )}
  <button
    style={{
      background: "red",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      cursor: "pointer"
    }}
    onClick={async () => {
      const confirmDelete = window.confirm(
        "Are you sure you want to permanently delete your account?"
      );

      if (!confirmDelete) return;

      try {
        await clientServer.post("/api/users/delete_account");
          
        

      
        router.push("/login");
      } catch (error) {
        alert("Failed to delete account");
      }
    }}
  >
    Delete Account
  </button>
</div>

 {isModalOpen && (
  <div onClick={()=>{
    setIsModalOpen(false)
  }}
  
  
  className={styles.commentsContainer}>
    <div  onClick={(e)=>{e.stopPropagation()}}className={styles.allCommentsContainer}>
        <input
                className={styles.inputField}
                type="text"
                placeholder="Enter Position"
                onChange={handleWorkInputChange}
                name="position"
              />
                <input
                className={styles.inputField}
                type="text"
                placeholder="Enter  Company"
                onChange={handleWorkInputChange}
                name='company'
              />
                <input
                className={styles.inputField}
                type="number"
                placeholder="Years"
                onChange={handleWorkInputChange}
                name="years"
              />
        <div onClick={()=>{
  setUserProfile({...userProfile,pastWork:[...userProfile.pastWork,inputData]})
  setIsModalOpen(false)
        }} className={styles.upadateNameButton}>Add Work</div>
    </div>

</div>
)}
{isPostModalOpen && (
<div
onClick={()=>setIsPostModalOpen(false)}
className={styles.commentsContainer}
>

<div
onClick={(e)=>e.stopPropagation()}
className={styles.allCommentsContainer}
>

<input
className={styles.inputField}
type="text"
placeholder="Write your post"
name="body"
value={postInput.body}
onChange={handlePostChange}
/>

<input
type="file"
onChange={handleFileChange}
/>

<div
onClick={addPostToProfile}
className={styles.upadateNameButton}
>
Add Post
</div>

</div>

</div>
)}
{isEducationModalOpen && (
<div
onClick={()=>setIsEducationModalOpen(false)}
className={styles.commentsContainer}
>

<div
onClick={(e)=>e.stopPropagation()}
className={styles.allCommentsContainer}
>

<input
className={styles.inputField}
type="text"
placeholder="School / College"
name="school"
onChange={handleEducationInputChange}
/>

<input
className={styles.inputField}
type="text"
placeholder="Degree"
name="degree"
onChange={handleEducationInputChange}
/>

<input
className={styles.inputField}
type="text"
placeholder="Field Of Study"
name="fieldOfStudy"
onChange={handleEducationInputChange}
/>

<div
onClick={async ()=>{

const updatedEducation = [
  ...userProfile.education,
  educationInput
];

await clientServer.post(
  "/api/users/update_profile_data",
  {
    bio: userProfile?.bio,
    currentPost: userProfile?.currentPost,
    pastWork: userProfile?.pastWork,
    education: updatedEducation
  }
);

await dispatch(getAboutUser());

setIsEducationModalOpen(false);

}}

className={styles.upadateNameButton}
>
Add Education
</div>

</div>

</div>
)}
   </div>       


            )}
            
            

  
</DashboardLayout>
</UserLayout>
)
}


