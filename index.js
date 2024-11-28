
    // Persistent storage keys
    const STUDENTS_KEY = "students";
    const COURSES_KEY = "courses";
    const LOGGED_IN_USER_KEY = "loggedInUser";

    // Initialize data
    let students = JSON.parse(localStorage.getItem(STUDENTS_KEY)) || [
      { name: "John Doe", score: 85 },
      { name: "Jane Smith", score: 90 },
    ];
    let courses = JSON.parse(localStorage.getItem(COURSES_KEY)) || [
      "Mathematics", "Physics", "Chemistry", "Biology", "History"
    ];
    let loggedInUser = JSON.parse(localStorage.getItem(LOGGED_IN_USER_KEY));

    const coursesDropdown = document.getElementById("courses");
    const studentCoursesDiv = document.getElementById("student-courses");
    const chartCtx = document.getElementById("performance-chart").getContext("2d");

    // Chart setup
    let performanceChart = new Chart(chartCtx, {
      type: "bar",
      data: {
        labels: students.map(student => student.name),
        datasets: [{
          label: "Performance Score",
          data: students.map(student => student.score),
          backgroundColor: "rgba(0, 123, 255, 0.6)",
        }],
      },
    });

    function login() {
      const role = document.getElementById("role-select").value;
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!role || !username || !password) {
        alert("Please fill in all fields.");
        return;
      }

      loggedInUser = { role, username };
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(loggedInUser));

      document.getElementById("login-section").classList.add("hidden");
      document.getElementById("role-sections").classList.remove("hidden");
      document.getElementById(`${role}-section`).classList.remove("hidden");

      populateCourses();
      populateStudentTable();
    }

    function logout() {
      localStorage.removeItem(LOGGED_IN_USER_KEY);
      loggedInUser = null;
      document.getElementById("role-sections").classList.add("hidden");
      document.getElementById("login-section").classList.remove("hidden");
      document.querySelectorAll(".role-section").forEach(section => section.classList.add("hidden"));
    }

    function populateCourses() {
      coursesDropdown.innerHTML = `<option value="" disabled selected>Choose a course</option>`;
      courses.forEach(course => {
        const option = new Option(course, course);
        coursesDropdown.add(option);
      });
    }

    const btn = document.getElementById('student-add-course')
    btn.addEventListener('click', function addCourse() {
      const selectedCourse = coursesDropdown.value;
      if (!selectedCourse) {
        alert("Please select a course.");
        return;
      }
      if (document.getElementById(`student-${selectedCourse}`)) {
        alert("Course already added.");
        return;
      }
      const courseItem = document.createElement("div");
      courseItem.className = "course-item";
      courseItem.id = `student-${selectedCourse}`;
      courseItem.innerHTML = `
        <span>${selectedCourse}</span>
        <button onclick="dropCourse('${selectedCourse}')">Drop</button>
      `;
      studentCoursesDiv.appendChild(courseItem);
    })

    function dropCourse(course) {
      const courseItem = document.getElementById(`student-${course}`);
      if (courseItem) {
        courseItem.remove();
      }
    }

    function addStudent() {
      const name = document.getElementById("new-student-name").value.trim();
      const score = document.getElementById("new-student-score").value;

      if (!name || !score) {
        alert("Please provide valid student data.");
        
      }else{
        students.push({ name, score });
        localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  
        document.getElementById("new-student-name").value = "";
        document.getElementById("new-student-score").value = "";
  
        populateStudentTable();
        updateChart();
      }

     
    }

    function addNewCourse() {
      const courseName = document.getElementById("new-course").value.trim();

      if (!courseName) {
        alert("Please provide a valid course name.");
        return;
      }

      courses.push(courseName);
      localStorage.setItem(COURSES_KEY, JSON.stringify(courses));

      document.getElementById("new-course").value = "";
      populateCourses();
    }

    function populateStudentTable() {
      const tableBody = document.querySelector("#student-table tbody");
      tableBody.innerHTML = "";
      students.forEach(student => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = student.name;
        row.insertCell(1).textContent = student.score;
      });
    }

    function updateChart() {
      performanceChart.data.labels = students.map(student => student.name);
      performanceChart.data.datasets[0].data = students.map(student => student.score);
      performanceChart.update();
    }

    // Restore session on reload
    if (loggedInUser) {
      document.getElementById("login-section").classList.add("hidden");
      document.getElementById("role-sections").classList.remove("hidden");
      document.getElementById(`${loggedInUser.role}-section`).classList.remove("hidden");
      populateCourses();
      populateStudentTable();
    }

