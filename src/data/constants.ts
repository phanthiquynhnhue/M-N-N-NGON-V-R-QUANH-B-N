import { BudgetOption, FoodCategory } from '../types';

export const CATEGORIES: FoodCategory[] = [
  {
    id: 'Tất cả',
    label: 'Tất cả món',
    icon: '✨',
    description: 'Khám phá mọi món ngon trong khu vực'
  },
  {
    id: 'Ăn sáng',
    label: 'Ăn sáng',
    icon: '🍳',
    description: 'Phở, Bánh mì chảo, Xôi xéo, Hủ tiếu, Bún bò'
  },
  {
    id: 'Cơm trưa',
    label: 'Cơm trưa / Bình dân',
    icon: '🍛',
    description: 'Cơm tấm sườn bì, Cơm gà xối mỡ, Cơm niêu, Cơm phần'
  },
  {
    id: 'Bún / Phở / Món nước',
    label: 'Bún / Phở / Hủ tiếu',
    icon: '🍜',
    description: 'Bún bò Huế, Bún riêu, Phở bò tái nạm, Mì Quảng'
  },
  {
    id: 'Ăn vặt',
    label: 'Ăn vặt / Trà sữa',
    icon: '🧋',
    description: 'Bánh tráng trộn, Phá lấu, Nem chua rán, Chè, Trà đào'
  },
  {
    id: 'Lẩu / Nướng',
    label: 'Lẩu / Nướng',
    icon: '🥘',
    description: 'Lẩu bò, Lẩu Thái chua cay, Nướng ngói, Nướng xiên que'
  },
  {
    id: 'Cà phê & Học bài',
    label: 'Cà phê & Học bài',
    icon: '☕',
    description: 'Quán có điều hòa, wifi mạnh, ổ cắm điện, giá sinh viên'
  }
];

export const BUDGET_OPTIONS: BudgetOption[] = [
  {
    id: 'under_35k',
    label: 'Dưới 35k',
    subText: 'Siêu tiết kiệm / Cuối tháng',
    min: 15,
    max: 35
  },
  {
    id: 'under_50k',
    label: 'Dưới 50k',
    subText: 'Bình dân chuẩn sinh viên',
    min: 25,
    max: 50
  },
  {
    id: '50k_100k',
    label: '50k - 100k',
    subText: 'Ăn ngon no nê / Dân văn phòng',
    min: 50,
    max: 100
  },
  {
    id: '100k_200k',
    label: '100k - 200k',
    subText: 'Lẩu nướng / Tụ tập cuối tuần',
    min: 100,
    max: 200
  },
  {
    id: 'above_200k',
    label: 'Trên 200k',
    subText: 'Buffet / Hải sản / Tiệc tùng',
    min: 200,
    max: 500
  }
];

export const POPULAR_LOCATIONS = [
  {
    name: 'Quận Bình Thạnh (D2, Ung Văn Khiêm)',
    query: 'Quận Bình Thạnh, TP.HCM',
    badge: 'Đông sinh viên HUTECH, FTU'
  },
  {
    name: 'Gần ĐH Ngân Hàng (Hoàng Diệu 2, Thủ Đức)',
    query: 'Gần trường Đại học Ngân Hàng TP.HCM, Hoàng Diệu 2, Thủ Đức',
    badge: 'Khu ẩm thực BUH cực rẻ'
  },
  {
    name: 'Làng Đại Học Thủ Đức (KTX Khu A & B)',
    query: 'Làng Đại học Quốc gia TP.HCM, Thủ Đức',
    badge: 'Thiên đường ăn uống sinh viên'
  },
  {
    name: 'Quận 10 (Sư Vạn Hạnh, Bắc Hải, Bách Khoa)',
    query: 'Quận 10, gần ĐH Bách Khoa TP.HCM',
    badge: 'Phố ẩm thực sinh viên & teen'
  },
  {
    name: 'Quận 1 (Khu Cô Giang, Đề Thám, Trần Khắc Chân)',
    query: 'Quận 1, TP.HCM (quán ăn bình dân)',
    badge: 'Ngon rẻ trung tâm Sài Gòn'
  },
  {
    name: 'Quận Gò Vấp (Khu ĐH Công nghiệp, Quang Trung)',
    query: 'Quận Gò Vấp, TP.HCM (gần ĐH Công Nghiệp)',
    badge: 'Ăn vặt & lẩu nướng ngập tràn'
  }
];

export const AMENITY_TAGS = [
  { id: 'air_conditioned', label: 'Có máy lạnh mát mẻ', icon: '❄️' },
  { id: 'street_side', label: 'Quán vỉa hè thoáng mát', icon: '🍃' },
  { id: 'group_friendly', label: 'Đi nhóm bạn bè', icon: '👥' },
  { id: 'solo_friendly', label: 'Đi ăn một mình thoải mái', icon: '👤' },
  { id: 'late_night', label: 'Mở khuya / Đêm', icon: '🌙' },
  { id: 'free_parking', label: 'Chỗ gửi xe dễ dàng', icon: '🛵' },
  { id: 'student_discount', label: 'Có ưu đãi sinh viên', icon: '🎓' }
];

export const LOADING_FACTS = [
  'Đang quét các đánh giá từ Google Maps và cộng đồng ẩm thực...',
  'Đang lọc theo mức ngân sách hợp lý nhất cho bạn...',
  'Kiểm tra tình trạng quán mở cửa và thực đơn ngon nhất...',
  'Tìm các quán được đánh giá cao trên 4.0 sao gần địa điểm của bạn...',
  'Thu thập các mẹo địa phương: chỗ gửi xe, giờ cao điểm...'
];
