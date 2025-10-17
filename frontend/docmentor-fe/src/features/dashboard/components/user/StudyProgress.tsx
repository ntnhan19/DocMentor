// User dashboard components
const StudyProgress = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        📈 Tiến độ học tập
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600 mb-1">Tuần này</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-500 h-3 rounded-full"
              style={{ width: "70%" }}
            ></div>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Tháng này</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-500 h-3 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyProgress;
