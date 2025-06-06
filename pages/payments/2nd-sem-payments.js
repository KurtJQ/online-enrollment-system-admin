import Link from "next/link";
import Login from "@/pages/Login";
import { useEffect, useState, useMemo  } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/Loading";
import { useRouter } from "next/router";
const allowedRoles = ["admin", "superAdmin", "accountant"];
export default function SecondSemester() {
  const [groupedPayments, setGroupedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const [initialized, setInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

const isAuthorized = useMemo(() => {
  return session?.user?.role && allowedRoles.includes(session.user.role);
}, [session]); // ✅ ESLint is happy

  useEffect(() => {
    if (status !== "loading" && session && !isAuthorized) {
      toast.error("Access denied.");
      router.push("/");
    }
  }, [status, session, isAuthorized, router]);
  useEffect(() => {
  if (!session || initialized || !isAuthorized) return;

    const fetchPayments = async () => {
      try {
        const response = await axios.get("/api/get-all-payments");

        if (response.data.data.length === 0) {
          toast("No payments returned from backend. 😕");
          return;
        }

        const semesterPayments = response.data.data.filter(
          (payment) => payment.semester === "2nd Semester"
        );

        const grouped = {};
        semesterPayments.forEach((payment) => {
          const sid = payment.studentId;
          if (!grouped[sid]) {
            grouped[sid] = {
              studentId: sid,
              fullName: payment.fullName,
              course: payment.course,
              education: payment.education,
              yearLevel: payment.yearLevel,
              schoolYear: payment.schoolYear,
              semester: payment.semester,
              payments: [],
            };
          }
          grouped[sid].payments.push({
            examPeriod: payment.examPeriod,
            status: payment.status,
            referenceNumber: payment.referenceNumber,
          });
        });

        const groupedArray = Object.values(grouped);
        setGroupedPayments(groupedArray);
        toast.success("Second Semester Payments loaded! ✅");
        setInitialized(true);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error("Failed to load payments: " + error.response.data.message);
        } else {
          toast.error("Failed to load payments." + error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [session, initialized, isAuthorized]);

  useEffect(() => {
    if (!session) {
      toast.error("You are not logged in.");
    }
  }, [session]);


  if (status === "loading") return <LoadingSpinner />;
  if (!session) return <Login />;
  if (!isAuthorized) return null; // redirecting


  const examPeriods = [
    "Downpayment",
    "1st Periodic",
    "Prelim",
    "2nd Periodic",
    "Midterm",
    "3rd Periodic",
    "Pre-final",
    "4th Periodic",
    "Finals",
  ];

  const filteredStudents = groupedPayments.filter((student) =>
    `${student.studentId} ${student.fullName} ${student.course}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Login>
      <div className="container mx-auto p-4">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-2">
              <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                Second Semester Payments Only
              </h1>
              <div className="flex justify-end mb-4">
                <Link
                  href={`/all-payments`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
                >
                  ← Go to First Semester Payments
                </Link>
              </div>
            </div>

            <input
              type="text"
              placeholder="Search by Name or Student ID"
              className="w-full p-3 mb-6 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
              <table className="min-w-full text-left table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border p-2 dark:border-gray-700 dark:text-gray-300">#</th>
                    <th className="border p-2 dark:border-gray-700 dark:text-gray-300">Student Info</th>
                    {examPeriods.map((period, index) => (
                      <th key={index} className="border p-2 text-center dark:border-gray-700 dark:text-gray-300">
                        {period}
                      </th>
                    ))}
                    <th className="border p-2 text-center dark:border-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => {
                      const paymentsByPeriod = {};
                      student.payments.forEach((payment) => {
                        paymentsByPeriod[payment.examPeriod] = payment.status;
                      });
                      return (
                        <tr key={student.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="border p-2 text-center dark:border-gray-700 dark:text-gray-200">
                            {index + 1}
                          </td>
                          <td className="border p-2 dark:border-gray-700 dark:text-gray-200">
                            <div className="font-semibold">{student.fullName}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              ID: {student.studentId}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {student.course} • {student.education} • Year Level: {student.yearLevel}
                            </div>
                            <div className="text-sm text-gray-400 dark:text-gray-500">
                              SY {student.schoolYear} • {student.semester}
                            </div>
                          </td>
                          {examPeriods.map((period, idx) => {
                            const isRemainingPaid = paymentsByPeriod["Remaining"] === "paid";
                            const icon = isRemainingPaid|| paymentsByPeriod[period] === "paid" ? "✅" : paymentsByPeriod[period] === "pending" || paymentsByPeriod[period] === "unpaid" ? "🕓" : paymentsByPeriod[period] === "failed" ? "❌" : "—";
                            return (
                              <td key={idx} className="border p-2 text-center dark:border-gray-700 dark:text-gray-200">
                              {icon}
                            </td>
                            );
                          })}
                          <td className="border p-2 text-center dark:border-gray-700">
                            <Link
                              href={`/payments/view/2ndsem/${student.studentId}/payments`}
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={examPeriods.length + 3} className="text-center p-4 dark:text-gray-300">
                        No Second Semester payments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Login>
  );
}
