import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import PlanBadge from "@/components/ui/PlanBadge/PlanBadge";
import { RefreshCw } from "lucide-react";

// Optimized UserPlanCard Component with memoization
export const UserPlanCard = React.memo(
  ({ userPlan, uploadStats, onRefresh, loading }) => {
    const { post } = useApp();
    const { maxImageSizeMB, maxVideoSizeMB } = post;
    const [timeLeft, setTimeLeft] = useState("");

    // Memoize the time calculation function
    const calculateTimeLeft = useCallback(() => {
      if (!userPlan.end_date) return;

      const endDate = new Date(userPlan.end_date);
      const now = new Date();
      const difference = endDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (days > 0) {
          setTimeLeft(`${days} ngày ${hours} giờ`);
        } else if (hours > 0) {
          setTimeLeft(`${hours} giờ ${minutes} phút`);
        } else {
          setTimeLeft(`${minutes} phút`);
        }
      } else {
        setTimeLeft("Đã hết hạn");
      }
    }, [userPlan.end_date]);

    useEffect(() => {
      if (!userPlan.end_date) return;

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

      return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    // Helper function to format date to dd/mm/yy
    const formatDate = (dateString) => {
      if (!dateString || dateString === "∞") return dateString;

      try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
      } catch (error) {
        return dateString; // Return original if parsing fails
      }
    };
    // Memoize the rendered JSX to prevent unnecessary re-renders
    return useMemo(
      () => (
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-white via-purple-50 to-purple-100 border border-purple-200 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Header với Avatar và Badge */}
          <div className="relative bg-gradient-to-r p-4 lg:p-4 text-base-content mx-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="relative">
                  <img
                    src={userPlan.profile_picture || "./prvlocket.png"}
                    alt="Avatar"
                    className="w-16 h-16 lg:w-16 lg:h-16 rounded-full object-cover p-[2px] outline-accent outline-3 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div>
                  <h1 className="font-semibold text-3xl text-black mb-1">
                    {userPlan.display_name}
                  </h1>
                  <p className="text-black text-xs lg:text-sm font-semibold">
                    ✨ Gói hiện tại
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PlanBadge />
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className={`p-2 rounded-full transition-all text-black duration-200 ${
                    loading
                      ? "bg-primary/30 cursor-wait"
                      : "bg-primary/30 hover:bg-primary/70 backdrop-blur-sm border border-white/30"
                  }`}
                  title="Cập nhật gói"
                >
                  <RefreshCw
                    className={`w-4 h-4 text-black ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Nội dung chính */}
          <div className="p-4 lg:p-6 space-y-4">
            {/* Thông tin thời gian */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500 text-base lg:text-lg">
                    🟢
                  </span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Bắt đầu
                  </span>
                </div>
                <p className="font-bold text-gray-800 text-sm lg:text-base">
                  {formatDate(userPlan.start_date)}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-500 text-base lg:text-lg">🔚</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Kết thúc
                  </span>
                </div>
                <p className="font-bold text-gray-800 text-sm lg:text-base">
                  {formatDate(userPlan.end_date) || "∞"}
                </p>
              </div>
            </div>

            {/* Thống kê upload và giới hạn */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Thống kê upload */}
              <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-purple-100">
                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-base lg:text-lg">📊</span>
                  <span className="text-sm lg:text-base">
                    Thống kê tải lên
                  </span>{" "}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="bg-blue-50 rounded-xl p-2 lg:p-3 mb-2">
                      <span className="text-blue-500 text-xl lg:text-2xl">
                        🖼️
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Ảnh đã tải</p>
                    <p className="font-bold text-blue-600 text-sm lg:text-base">
                      {uploadStats?.image_uploaded || 0}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-red-50 rounded-xl p-2 lg:p-3 mb-2">
                      <span className="text-red-500 text-xl lg:text-2xl">
                        🎥
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Video đã tải</p>
                    <p className="font-bold text-red-600 text-sm lg:text-base">
                      {uploadStats?.video_uploaded || 0}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-green-50 rounded-xl p-2 lg:p-3 mb-2">
                      <span className="text-green-500 text-xl lg:text-2xl">
                        💾
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Dung lượng</p>
                    <p className="font-bold text-green-600 text-sm lg:text-base">
                      {uploadStats?.total_storage_used_mb || 0} MB
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-yellow-50 rounded-xl p-2 lg:p-3 mb-2">
                      <span className="text-yellow-500 text-xl lg:text-2xl">
                        ⚠️
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Bị lỗi</p>
                    <p className="font-bold text-yellow-600 text-sm lg:text-base">
                      {uploadStats?.error_count || 0}
                    </p>
                  </div>
                </div>
                {/* <span className="text-xs text-gray-500">{uploadStats?.updatedAt}</span> */}
              </div>

              {/* Thông tin giới hạn */}
              <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-purple-100">
                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-base lg:text-lg">📁</span>
                  <span className="text-sm lg:text-base">Giới hạn tải lên</span>
                </h4>
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base lg:text-lg">🖼️</span>
                      <span className="text-xs lg:text-sm font-medium text-gray-600">
                        Ảnh tối đa
                      </span>
                    </div>
                    <span className="text-xs lg:text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                      {maxImageSizeMB
                        ? `${maxImageSizeMB} MB`
                        : "Không giới hạn"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base lg:text-lg">🎥</span>
                      <span className="text-xs lg:text-sm font-medium text-gray-600">
                        Video tối đa
                      </span>
                    </div>
                    <span className="text-xs lg:text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                      {maxVideoSizeMB
                        ? `${maxVideoSizeMB} MB`
                        : "Không giới hạn"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base lg:text-lg">💾</span>
                      <span className="text-xs lg:text-sm font-medium text-gray-600">
                        Dung lượng tối đa
                      </span>
                    </div>
                    <span className="text-xs lg:text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                      {userPlan?.plan_info?.storage_limit_mb === -1
                        ? "Không giới hạn"
                        : `${userPlan?.plan_info?.storage_limit_mb} MB`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status bar với countdown */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 lg:p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium text-xs lg:text-sm">
                    Đang hoạt động
                  </span>
                </div>
                <span className="text-green-600 text-xs lg:text-sm font-medium">
                  {userPlan.end_date
                    ? timeLeft === "Đã hết hạn"
                      ? timeLeft
                      : `Còn ${timeLeft}`
                    : "Vĩnh viễn"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      [userPlan, maxImageSizeMB, maxVideoSizeMB, timeLeft, onRefresh, loading]
    );
  }
);
