import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-hot-toast";

function formatLandline(value) {
  const cleaned = value.replace(/\D/g, ""); // Remove non-numeric characters
  const formatted = cleaned.slice(0, 11); // Limit to 11 digits

  if (formatted.length <= 3) {
    return formatted; // Return as is if 3 or fewer digits
  } else if (formatted.length <= 5) {
    return `${formatted.slice(0, 2)}-${formatted.slice(2)}`; // Format as XX-XXX for 4-5 digits
  } else if (formatted.length <= 8) {
    return `${formatted.slice(0, 2)}-${formatted.slice(2, 5)}-${formatted.slice(5)}`; // Format as XX-XXX-XXXX for 6-8 digits
  } else {
    return `${formatted.slice(0, 2)}-${formatted.slice(2, 5)}-${formatted.slice(5, 8)}-${formatted.slice(8)}`; // Format as XX-XXX-XXX-XXX for 9-11 digits
  }
}


export default function StudentForm({
  _studentId,
  fname: existingFname = "",
  mname: existingMname = "",
  lname: existingLname = "",
  address: existingAddress = "",
  mobile: existingMobile = "",
  landline: existingLandline = "",
  facebook: existingFacebook = "",
  birthdate: existingBirthdate = "",
  birthplace: existingBirthplace = "",
  nationality: existingNationality = "",
  religion: existingReligion = "",
  sex: existingSex = "",
  father: existingFather = "",
  mother: existingMother = "",
  guardian: existingGuardian = "",
  guardianOccupation: existingGuardianOccupation = "",
  registrationDate: existingRegistrationDate = "",
  lrn: existingLrn = "",
  education: existingEducation = "",
  course: existingCourse = "",
  yearLevel: existingYearLevel = "",
  schoolYear: existingSchoolYear = "",
  email: existingEmail = "",
  password: existingPassword = "",
  semester: existingSemester = "",
  nursery = { yearAttended: "", schoolName: "" },
  elementary = { yearAttended: "", schoolName: "" },
  juniorHigh = { yearAttended: "" , schoolName: "" },
  seniorHigh = { yearAttended: "", schoolName: "" },
  status: existingStatus = "",
}) {
  const [fname, setFname] = useState(existingFname);
  const [mname, setMname] = useState(existingMname);
  const [lname, setLname] = useState(existingLname);
  const [address, setAddress] = useState(existingAddress);
  const [mobile, setMobile] = useState(existingMobile);
  const [landline, setLandline] = useState(existingLandline);
  const [facebook, setFacebook] = useState(existingFacebook);
  const [birthdate, setBirthdate] = useState(existingBirthdate);
  const [birthplace, setBirthplace] = useState(existingBirthplace);
  const [nationality, setNationality] = useState(existingNationality);
  const [religion, setReligion] = useState(existingReligion);
  const [sex, setSex] = useState(existingSex);
  const [father, setFather] = useState(existingFather);
  const [mother, setMother] = useState(existingMother);
  const [guardian, setGuardian] = useState(existingGuardian);
  const [guardianOccupation, setGuardianOccupation] = useState(existingGuardianOccupation);
  const [registrationDate, setRegistrationDate] = useState(
    existingRegistrationDate ? existingRegistrationDate.split("T")[0] : new Date().toISOString().split("T")[0]
  );
  const [lrn, setLrn] = useState(existingLrn);
  const [education, setEducation] = useState(existingEducation);
  const [course, setCourse] = useState(existingCourse);
  const [yearLevel, setYearLevel] = useState(existingYearLevel);
  const [schoolYear, setSchoolYear] = useState(existingSchoolYear);
  const [email, setEmail] = useState(existingEmail);
  const [password, setPassword] = useState(existingPassword);
  const [semester, setSemester] = useState(existingSemester);
  const [status, setStatus] = useState(existingStatus);
  const [nurseryState, setNursery] = useState(nursery || { schoolName: "", yearAttended: "" });
  const [elementaryState, setElementary] = useState(elementary || { schoolName: "", yearAttended: "" });
  const [juniorHighState, setJuniorHigh] = useState(juniorHigh || { schoolName: "", yearAttended: "" });
  const [seniorHighState, setSeniorHigh] = useState(seniorHigh || { schoolName: "", yearAttended: "" });
  const [goToStudents, setGoToStudents] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function saveStudent(ev) {
    ev.preventDefault();
  
    const studentInfo = {
      fname,mname,lname,address,mobile,landline,facebook,birthdate,birthplace,nationality,religion,sex,father,mother,guardian,guardianOccupation,registrationDate,lrn,education,course,yearLevel,schoolYear,email,password,semester,nursery: nurseryState,elementary: elementaryState,juniorHigh: juniorHighState,seniorHigh: seniorHighState,status
    };

    console.log("Form state data being sent to server:", studentInfo);
  
    // Only include _studentId when updating
    if (_studentId) {
      studentInfo._studentId = _studentId;
    }
  
    console.log("Data being sent:", studentInfo);
  
    try {
   
      const response = await axios({
        method: _studentId ? "PUT" : "POST",
        url: _studentId ? `/api/students?id=${_studentId}` : "/api/students",
        data: studentInfo,
        headers: { "Content-Type": "application/json" },
      });
    
      toast.success('Student saved successfully');
    
      if (response.status >= 200 && response.status < 300) {
            setGoToStudents(true);
          }


  } catch (error) {
  console.error('Error occurred during student save:', error);

  if (error.response && error.response.data && error.response.data.error) {
    // Display the error message directly from the backend
    toast.error(`Error saving student: ${error.response.data.error}`);
  } else {
    // Fallback for unexpected errors
    toast.error(`Error saving student: ${error.message}`);
  }
} finally {
  setLoading(false);
}
  }
  useEffect(() => {
    if (goToStudents) {
      router.push("/students");
    }
  }, [goToStudents, router]);

return (
<form onSubmit={saveStudent}>
      <div className="space-y-2">
        <div className="flex justify-center items-center gap-4">
          <label className="block text-gray-700 dark:text-white dark:text-white font-bold mb-2 text-2xl">
            Personal Information
          </label>
        </div>
      <div className="flex flex-wrap gap-4 items-start">
  <div className="space-y-2 w-full sm:w-[30%]">
    <label className="block font-bold text-gray-700 dark:text-white">
      First Name <span className="text-gray-700 dark:text-white">*</span>
    </label>
    <input
      type="text"
      placeholder="Enter first name"
      value={fname}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
      onChange={(ev) =>
        setFname(
          ev.target.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
        )
      }
      required
    />
  </div>

  <div className="space-y-2 w-full sm:w-[30%]">
    <label className="block font-bold text-gray-700 dark:text-white">
      Middle Name
    </label>
    <input
      type="text"
      placeholder="Enter middle name"
      value={mname}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
      onChange={(ev) =>
        setMname(
          ev.target.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
        )
      }
    />
  </div>

  <div className="space-y-2 w-full sm:w-[30%]">
    <label className="block font-bold text-gray-700 dark:text-white">
      Last Name <span className="text-red-500 font-bold">*</span>
    </label>
    <input
      type="text"
      placeholder="Enter last name"
      value={lname}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
      onChange={(ev) =>
        setLname(
          ev.target.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
        )
      }
      required
    />
  </div>
</div>
<div className="flex flex-wrap gap-4 items-start">
  <div className="space-y-2 w-full sm:w-[30%]">
    <label className="block font-bold text-gray-700 dark:text-white">
      Address <span className="text-red-500 font-bold">*</span>
    </label>
    <input
      type="text"
      placeholder="Enter address"
      value={address}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
      onChange={(ev) =>
        setAddress(
          ev.target.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
        )
      }
      required
    />
  </div>

  <div className="space-y-2 w-full sm:w-[30%]">
    <label className="block font-bold text-gray-700 dark:text-white">
      Mobile Number <span className="text-red-500 font-bold">*</span>
    </label>
    <input
      type="text"
      placeholder="Enter mobile number"
      value={mobile}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
      onChange={(ev) => {
        let input = ev.target.value.replace(/\D/g, "");
        if (input.length > 11) input = input.slice(0, 11);
        if (input.length > 7)
          input = input.replace(/^(\d{4})(\d{3})(\d{0,4})$/, "$1-$2-$3");
        else if (input.length > 4)
          input = input.replace(/^(\d{4})(\d{0,3})$/, "$1-$2");
        setMobile(input);
      }}
      maxLength="13"
      required
    />
  </div>

  <div className="space-y-2 w-full sm:w-[30%]">
    <label className="block font-bold text-gray-700 dark:text-white">
      Landline Number
    </label>
    <input
      type="tel"
      name="landline"
      placeholder="Landline Number (11 digits)"
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
      value={landline}
      onChange={(e) => {
        const formattedLandline = formatLandline(e.target.value);
        setLandline(formattedLandline);
      }}
    />
  </div>
</div>

<div className="flex flex-wrap gap-4 items-start">
  <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white"
          >Facebook <span className="text-red-500 font-bold">*</span></label>
          <input
            type="url"
            placeholder="Enter Facebook link"
           className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={facebook}
            onChange={(ev) => setFacebook(ev.target.value)}
            required
          />
        </div>
        <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white"
          >Date of Birth <span className="text-red-500 font-bold">*</span></label>
          <input
            type="date"
            value={birthdate}
           className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => setBirthdate(ev.target.value)}
            // required
          />
        </div>
        <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white"
          >Place of Birth <span className="text-red-500 font-bold">*</span></label>
          <input
            type="text"
            placeholder="Enter place of birth"
            value={birthplace}
           className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => setBirthplace(ev.target.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()))}
            required
          />
        </div>
    </div>

    <div className="flex flex-wrap gap-4 items-start">
    <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white"
          >Nationality <span className="text-red-500 font-bold">*</span></label>
          <input
            type="text"
            placeholder="Enter nationality"
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={nationality}
            onChange={(ev) => setNationality(ev.target.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()))}
            required
          />
        </div>
        <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white"
          >Religion <span className="text-red-500 font-bold">*</span></label>
          <input
            type="text"
            placeholder="Enter religion"
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={religion}
            onChange={(ev) => setReligion(ev.target.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()))}
            required
          />
        </div>

        <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white"
          >Sex <span className="text-red-500 font-bold">*</span></label>
          <select
            value={sex}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => setSex(ev.target.value)}
            required
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
    </div>

    <div className="flex flex-wrap gap-4 items-start">
    <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white">Fathers Name</label>
          <input
            type="text"
            placeholder="Enter father's name"
            value={father}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => setFather(ev.target.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()))}
          />
        </div>

        <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white">Mothers Name</label>
          <input
            type="text"
            placeholder="Enter mother's name"
            value={mother}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => setMother(ev.target.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()))}
          />
        </div>

        <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white">Guardians Name <span className="text-red-500 font-bold">*</span></label>
          <input
            type="text"
            placeholder="Enter guardian's name"
            value={guardian}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => setGuardian(ev.target.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()))}
            required
          />
        </div>
    </div>

    <div className="flex flex-wrap gap-4 items-start">
    <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white"
          >Guardians Occupation <span className="text-red-500 font-bold">*</span></label>
          <input
            type="text"
            placeholder="Enter guardian's occupation"
            value={guardianOccupation}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => setGuardianOccupation(ev.target.value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()))}
            required
          />
        </div>
    </div>
    <div className="mt-8 pt-4">
  <hr className="border-t border-gray-300 dark:border-gray-600 mb-4" />
  <div className="flex justify-center items-center">
    <label className="block text-gray-700 dark:text-white font-bold mb-2 text-2xl">
      Academic Information
    </label>
  </div>
</div>
    <div className="flex flex-wrap gap-4 items-start">
    <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white">
            School Year <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter school year"
            value={schoolYear}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => {
              const raw = ev.target.value.replace(/\D/g, "").slice(0, 8); // remove non-digits, max 8 digits
              let formatted = raw;

              if (raw.length > 4) {
                formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
              }

              setSchoolYear(formatted);

              if (formatted.length === 9 && !/^\d{4}-\d{4}$/.test(formatted)) {
                toast.error("Please use the format YYYY-YYYY");
              }
            }}
            required
          />
        </div>
        <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white"
          >Year Level <span className="text-red-500 font-bold">*</span></label>
          <select value={yearLevel} onChange={(ev) => setYearLevel(ev.target.value)} className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" required>
            <option value="">Select Year Level</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white"
          >Education Level</label>
          <select value={education} onChange={(ev) => setEducation(ev.target.value)} className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700" required>
            <option value="">Select Education Level</option>
            <option value="college">College</option>
          </select>
        </div>
    </div>

    <div className="flex flex-wrap gap-4 items-start">
          {education === "college" && (
    <div className="space-y-2 w-full sm:w-[30%]">
              <label className="text-gray-700 font-bold mt-2 pt-2 dark:text-white">Course</label>
              <select
              value={course}
                className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
                onChange={(ev) => {
                  const value = ev.target.value.toUpperCase().slice(0, 10);
                  setCourse(value);
                }}
              >
              <option value="">Select Course</option>
              <option value="BSCS">BS Computer Science</option>
              <option value="BSHM">BS Hospitality Management</option>
              <option value="BSBA">BS Business Administration</option>
              <option value="BSTM">BS Tourism Management</option>
              <option value="BEED">Bachelor of Elementary Education</option>
              <option value="BSED-MATH">
                Bachelor of Secondary Education - Math
              </option>
              <option value="BSED-ENG">
                Bachelor of Secondary Education - English
              </option>
              <option value="BA-POLSCI">Bachelor of Arts - Political Science</option>
              </select>
            </div>
          )}
    <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white"
          >semester <span className="text-red-500 font-bold">*</span></label>
          <select
            value={semester}
            onChange={(ev) => setSemester(ev.target.value)}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            required
          >
            <option value="">Select Semester</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
          </select>
        </div>    
        
        <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white">LRN</label>
          <input
            type="number"
            placeholder="Enter LRN"
            value={lrn}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => {
              const value = ev.target.value.replace(/\D/g, "").slice(0, 12);
              setLrn(value);
            }}
          />
        </div>
        
        <div className="space-y-2 w-full sm:w-[30%]">
          <label className="text-gray-700 font-bold dark:text-white"
          >Registration Date</label>
          <input
            type="date"
            value={registrationDate}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => setRegistrationDate(ev.target.value)}
          />
        </div>
    </div>     

    <div className="flex flex-wrap gap-4">
  {/* Nursery School Name */}
  <div className="space-y-2 w-full sm:w-[23%]">
    <label className="text-gray-700 font-bold dark:text-white">Nursery School Attended</label>
    <input
      type="text"
      value={nurseryState.schoolName}
      onChange={(e) => setNursery({ ...nurseryState, schoolName: e.target.value })}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 capitalize"
    />
  </div>

  {/* Nursery Year */}
  <div className="space-y-2 w-full sm:w-[23%]">
    <label className="text-gray-700 font-bold dark:text-white">Nursery Year Attended</label>
    <input
      type="text"
      value={nurseryState.yearAttended}
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
        let formatted = raw;
        if (raw.length > 4) {
          formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
        }
        setNursery({ ...nurseryState, yearAttended: formatted });
        if (formatted.length === 9 && !/^\d{4}-\d{4}$/.test(formatted)) {
          toast.error("Please use the format YYYY-YYYY");
        }
      }}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
    />
  </div>

  {/* Elementary School Name */}
  <div className="space-y-2 w-full sm:w-[23%]">
    <label className="text-gray-700 font-bold dark:text-white">Elementary School Attended</label>
    <input
      type="text"
      value={elementaryState.schoolName}
      onChange={(e) => setElementary({ ...elementaryState, schoolName: e.target.value })}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 capitalize"
    />
  </div>

  {/* Elementary Year */}
  <div className="space-y-2 w-full sm:w-[20%]">
    <label className="text-gray-700 font-bold dark:text-white">Elementary Year Attended</label>
    <input
      type="text"
      value={elementaryState.yearAttended}
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
        let formatted = raw;
        if (raw.length > 4) {
          formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
        }
        setElementary({ ...elementaryState, yearAttended: formatted });
        if (formatted.length === 9 && !/^\d{4}-\d{4}$/.test(formatted)) {
          toast.error("Please use the format YYYY-YYYY");
        }
      }}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
    />
  </div>

  {/* Junior High School Name */}
  <div className="space-y-2 w-full sm:w-[23%]">
    <label className="text-gray-700 font-bold dark:text-white">Junior High School Attended</label>
    <input
      type="text"
      value={juniorHighState.schoolName}
      onChange={(e) => setJuniorHigh({ ...juniorHighState, schoolName: e.target.value })}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 capitalize"
    />
  </div>

  {/* Junior High Year */}
  <div className="space-y-2 w-full sm:w-[23%]">
    <label className="text-gray-700 font-bold dark:text-white">Junior High Year Attended</label>
    <input
      type="text"
      value={juniorHighState.yearAttended}
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
        let formatted = raw;
        if (raw.length > 4) {
          formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
        }
        setJuniorHigh({ ...juniorHighState, yearAttended: formatted });
        if (formatted.length === 9 && !/^\d{4}-\d{4}$/.test(formatted)) {
          toast.error("Please use the format YYYY-YYYY");
        }
      }}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
    />
  </div>

  {/* Senior High School Name */}
  <div className="space-y-2 w-full sm:w-[23%]">
    <label className="text-gray-700 font-bold dark:text-white">Senior High School Attended</label>
    <input
      type="text"
      value={seniorHighState.schoolName}
      onChange={(e) => setSeniorHigh({ ...seniorHighState, schoolName: e.target.value })}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 capitalize"
    />
  </div>

  {/* Senior High Year */}
  <div className="space-y-2 w-full sm:w-[20%]">
    <label className="text-gray-700 font-bold dark:text-white">Senior High Year Attended</label>
    <input
      type="text"
      value={seniorHighState.yearAttended}
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
        let formatted = raw;
        if (raw.length > 4) {
          formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
        }
        setSeniorHigh({ ...seniorHighState, yearAttended: formatted });
        if (formatted.length === 9 && !/^\d{4}-\d{4}$/.test(formatted)) {
          toast.error("Please use the format YYYY-YYYY");
        }
      }}
      className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
    />
  </div>
</div>

<div className="mt-8 pt-4">
  <hr className="border-t border-gray-300 dark:border-gray-600 mb-4" />
  <div className="flex justify-center items-center">
    <label className="block text-gray-700 dark:text-white font-bold mb-2 text-2xl">
      Account Information
    </label>
  </div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
          <label className="text-gray-700 font-bold dark:text-white"
          >Email Address <span className="text-red-500">*</span></label>
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-bold dark:text-white"
          >Password <span className="text-red-500">*</span></label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            minLength={8}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-bold dark:text-white"
          >Status <span className="text-red-500">*</span></label>
          <select
            value={status}
            className="w-full p-3 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            onChange={(ev) => setStatus(ev.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="enrolled">Enrolled</option>
            <option value="missing files">Missing Files</option>
          </select>
        </div>
        </div>

        <div className="flex items-center justify-center pt-4 mt-10">
  <button
    type="submit"
    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
  >
    {loading ? "Loading..." : "Submit"}
  </button>
</div>

        </div>
    </form>

  )
}