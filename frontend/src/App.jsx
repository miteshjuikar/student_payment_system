import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [studentForm, setStudentForm] = useState({
    name: "",
    mobile: "",
    email: "",
    state: "",
  });

  const [courseForm, setCourseForm] = useState({
    name: "",
    type: "",
    amount: "",
  });

  const [editingStudentId, setEditingStudentId] = useState("");
  const [editingCourseId, setEditingCourseId] = useState("");
  const [txnIdToRefund, setTxnIdToRefund] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [historyStudentId, setHistoryStudentId] = useState("");

  const [paymentForm, setPaymentForm] = useState({
    studentId: "",
    courseId: "",
  });

  const [message, setMessage] = useState("");

  // Load students and courses
  useEffect(() => {
    loadStudents();
    loadCourses();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load students");
    }
  };

  const loadCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load courses");
    }
  };

  // Student form
  const handleStudentChange = (event) => {
    setStudentForm({
      ...studentForm,
      [event.target.name]: event.target.value,
    });
  };

  const saveStudent = async (event) => {
    event.preventDefault();
    const isEditing = Boolean(editingStudentId);

    try {
      if (isEditing) {
        await api.put(`/students/${editingStudentId}`, studentForm);
      } else {
        await api.post("/students", studentForm);
      }

      setMessage(isEditing ? "Student updated successfully" : "Student created successfully");

      setStudentForm({
        name: "",
        mobile: "",
        email: "",
        state: "",
      });
      setEditingStudentId("");

      await loadStudents();
    } catch (error) {
      setMessage(
        error.response?.data?.message || `Failed to ${isEditing ? "update" : "create"} student`
      );
    }
  };

  const editStudent = (student) => {
    setEditingStudentId(student._id);
    setStudentForm({
      name: student.name,
      mobile: student.mobile,
      email: student.email,
      state: student.state,
    });
  };

  const deleteStudent = async (student) => {
    if (!window.confirm(`Delete student ${student.name}?`)) return;

    try {
      await api.delete(`/students/${student._id}`);
      setMessage("Student deleted successfully");
      setPaymentForm((current) => ({
        ...current,
        studentId: current.studentId === student._id ? "" : current.studentId,
      }));
      await loadStudents();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete student");
    }
  };

  const cancelStudentEdit = () => {
    setEditingStudentId("");
    setStudentForm({ name: "", mobile: "", email: "", state: "" });
  };

  // Course form
  const handleCourseChange = (event) => {
    setCourseForm({
      ...courseForm,
      [event.target.name]: event.target.value,
    });
  };

  const saveCourse = async (event) => {
    event.preventDefault();
    const isEditing = Boolean(editingCourseId);

    try {
      const courseData = {
        ...courseForm,
        amount: Number(courseForm.amount),
      };

      if (isEditing) {
        await api.put(`/courses/${editingCourseId}`, courseData);
      } else {
        await api.post("/courses", courseData);
      }

      setMessage(isEditing ? "Course updated successfully" : "Course created successfully");

      setCourseForm({
        name: "",
        type: "",
        amount: "",
      });
      setEditingCourseId("");

      await loadCourses();
    } catch (error) {
      setMessage(
        error.response?.data?.message || `Failed to ${isEditing ? "update" : "create"} course`
      );
    }
  };

  const editCourse = (course) => {
    setEditingCourseId(course._id);
    setCourseForm({
      name: course.name,
      type: course.type,
      amount: String(course.amount),
    });
  };

  const deleteCourse = async (course) => {
    if (!window.confirm(`Delete course ${course.name}?`)) return;

    try {
      await api.delete(`/courses/${course._id}`);
      setMessage("Course deleted successfully");
      setPaymentForm((current) => ({
        ...current,
        courseId: current.courseId === course._id ? "" : current.courseId,
      }));
      await loadCourses();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete course");
    }
  };

  const cancelCourseEdit = () => {
    setEditingCourseId("");
    setCourseForm({ name: "", type: "", amount: "" });
  };

  // Payment
  const handlePaymentChange = (event) => {
    setPaymentForm({
      ...paymentForm,
      [event.target.name]: event.target.value,
    });
  };

  const makePayment = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/payment", paymentForm);

      console.log("Payment response:", response.data);

      setMessage(
        `Payment successful. Transaction ID: ${response.data.data.transaction.txnId}`
      );

      setPaymentForm({
        studentId: "",
        courseId: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Payment failed"
      );
    }
  };

const refundPayment = async (event) => {
  event.preventDefault();

  try {
    const response = await api.post("/refund", {
      txnId: txnIdToRefund.trim(),
    });

    setMessage(
      `Refund record created. Refund ID: ${response.data.data.refund.txnId}`
    );

    setTxnIdToRefund("");

    if (historyStudentId) {
      await loadTransactionHistory(historyStudentId);
    }
  } catch (error) {
    setMessage(
      error.response?.data?.message || "Refund request failed"
    );
  }
};

const loadTransactionHistory = async (studentId) => {
  if (!studentId) {
    setMessage("Please select a student");
    return;
  }

  try {
    const response = await api.get(
      `/transactions/${studentId}`
    );

    setTransactions(response.data.data);
    setHistoryStudentId(studentId);
    setMessage("");
  } catch (error) {
    setMessage(
      error.response?.data?.message ||
      "Failed to load transaction history"
    );
  }
};

  return (
    <div className="container">
      <h1>Student Payment System</h1>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <div className="grid">

        {/* Student */}
        <section className="card">
          <h2>{editingStudentId ? "Edit Student" : "Add Student"}</h2>

          <form onSubmit={saveStudent}>
            <input
              name="name"
              placeholder="Student name"
              value={studentForm.name}
              onChange={handleStudentChange}
            />

            <input
              name="mobile"
              placeholder="Mobile"
              value={studentForm.mobile}
              onChange={handleStudentChange}
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={studentForm.email}
              onChange={handleStudentChange}
            />

            <input
              name="state"
              placeholder="State"
              value={studentForm.state}
              onChange={handleStudentChange}
            />

            <button type="submit">
              {editingStudentId ? "Save Student" : "Add Student"}
            </button>
            {editingStudentId && (
              <button className="secondary-button" type="button" onClick={cancelStudentEdit}>
                Cancel
              </button>
            )}
          </form>
        </section>

        {/* Course */}
        <section className="card">
          <h2>{editingCourseId ? "Edit Course" : "Add Course"}</h2>

          <form onSubmit={saveCourse}>
            <input
              name="name"
              placeholder="Course name"
              value={courseForm.name}
              onChange={handleCourseChange}
            />

            <input
              name="type"
              placeholder="Course type"
              value={courseForm.type}
              onChange={handleCourseChange}
            />

            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={courseForm.amount}
              onChange={handleCourseChange}
            />

            <button type="submit">
              {editingCourseId ? "Save Course" : "Add Course"}
            </button>
            {editingCourseId && (
              <button className="secondary-button" type="button" onClick={cancelCourseEdit}>
                Cancel
              </button>
            )}
          </form>
        </section>

        {/* Payment */}
        <section className="card">
          <h2>Make Payment</h2>

          <form onSubmit={makePayment}>
            <select
              name="studentId"
              value={paymentForm.studentId}
              onChange={handlePaymentChange}
            >
              <option value="">
                Select Student
              </option>

              {students.map((student) => (
                <option
                  key={student._id}
                  value={student._id}
                >
                  {student.name}
                </option>
              ))}
            </select>

            <select
              name="courseId"
              value={paymentForm.courseId}
              onChange={handlePaymentChange}
            >
              <option value="">
                Select Course
              </option>

              {courses.map((course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.name} - ₹{course.amount}
                </option>
              ))}
            </select>

            <button type="submit">
              Make Payment
            </button>
          </form>
        </section>

      </div>

      {/* Students */}
      <section className="list-card">
        <h2>Students</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.mobile}</td>
                <td>{student.email}</td>
                <td>{student.state}</td>
                <td className="row-actions">
                  <button className="row-action" type="button" onClick={() => editStudent(student)}>
                    Edit
                  </button>
                  <button className="row-action danger-button" type="button" onClick={() => deleteStudent(student)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Courses */}
      <section className="list-card">
        <h2>Courses</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.name}</td>
                <td>{course.type}</td>
                <td>₹{course.amount}</td>
                <td className="row-actions">
                  <button className="row-action" type="button" onClick={() => editCourse(course)}>
                    Edit
                  </button>
                  <button className="row-action danger-button" type="button" onClick={() => deleteCourse(course)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Process Refund Record</h2>

        <form onSubmit={refundPayment}>
          <input
            value={txnIdToRefund}
            onChange={(event) => setTxnIdToRefund(event.target.value)}
            placeholder="Original transaction ID"
            required
          />

          <button type="submit">Create Refund</button>
        </form>

        <p>
          Enter the transaction ID of an existing paid transaction.
        </p>
      </section>
      <section className="list-card">
        <h2>Transaction History</h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            loadTransactionHistory(historyStudentId);
          }}
        >
          <select
            value={historyStudentId}
            onChange={(event) => setHistoryStudentId(event.target.value)}
            required
          >
            <option value="">Select student</option>

            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} — {student.email}
              </option>
            ))}
          </select>

          <button type="submit">Load History</button>
        </form>

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Original transaction</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((txn) => (
                <tr key={txn._id}>
                  <td>{txn.txnId}</td>
                  <td>
                    {txn.courseId?.name || "Course unavailable"}
                  </td>
                  <td>
                    ₹{Number(txn.amount).toLocaleString("en-IN")}
                  </td>
                  <td>{txn.status.toUpperCase()}</td>
                  <td>{txn.previousTxnId || "—"}</td>
                  <td>
                    {new Date(txn.transactionDateTime).toLocaleString()}
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan="6">No transactions loaded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}

export default App;