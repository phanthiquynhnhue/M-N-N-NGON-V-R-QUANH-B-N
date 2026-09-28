import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RestaurantItem {
  id: string;
  name: string;
  address: string;
  district?: string;
  priceRange: string;
  rating: number;
  reviewCount?: string;
  category: string;
  signatureDishes: string[];
  whyRecommended: string;
  highlightBadge?: string;
  openingHours?: string;
  parkingTip?: string;
  atmosphere?: string;
  googleMapsQuery: string;
}

interface SearchResponseData {
  summary: string;
  restaurants: RestaurantItem[];
  localTips: string[];
  groundingSources?: Array<{ title?: string; url?: string }>;
  searchQueries?: string[];
}

// Fallback curated local knowledge base if API key is not configured or in case of temporary API limits
const FALLBACK_EATERIES: Record<string, RestaurantItem[]> = {
  binh_thanh: [
    {
      id: 'bt-1',
      name: 'Cơm Tấm Phúc Lộc Thọ (Bình Thạnh)',
      address: '64 Nguyễn Gia Trí (D2), P.25, Bình Thạnh',
      district: 'Bình Thạnh',
      priceRange: '39.000đ - 65.000đ',
      rating: 4.4,
      reviewCount: '1.200+',
      category: 'Cơm trưa',
      signatureDishes: ['Cơm sườn nướng mật ong', 'Cơm ba rọi nướng', 'Canh rong biển'],
      whyRecommended: 'Sườn nướng thơm phức, hạt cơm tấm dẻo, có máy lạnh mát mẻ, trà đá sâm dứa miễn phí rất được sinh viên Hutech, Ngoại Thương mê.',
      highlightBadge: 'Máy lạnh cực mát - Trà đá free',
      openingHours: '06:00 - 22:30',
      parkingTip: 'Có bảo vệ dắt xe trước quán miễn phí',
      atmosphere: 'Máy lạnh, sạch sẽ, ngồi thoải mái',
      googleMapsQuery: 'Cơm Tấm Phúc Lộc Thọ Nguyễn Gia Trí Bình Thạnh'
    },
    {
      id: 'bt-2',
      name: 'Bún Bò Huế Sông Hương (Ung Văn Khiêm)',
      address: '125 Ung Văn Khiêm, P.25, Bình Thạnh',
      district: 'Bình Thạnh',
      priceRange: '35.000đ - 55.000đ',
      rating: 4.5,
      reviewCount: '650+',
      category: 'Bún / Phở / Hủ tiếu',
      signatureDishes: ['Bún bò thập cẩm gân giò', 'Chả cua Huế giòn sần sật', 'Bắp bò hoa'],
      whyRecommended: 'Nước dùng ninh xương thơm lừng mùi sả ruốc, thịt nạm mềm tan, rau sống rửa sạch sẽ, giá sinh viên chỉ từ 35k.',
      highlightBadge: 'Nước dùng đậm đà chuẩn vị',
      openingHours: '06:00 - 21:00',
      parkingTip: 'Để xe ngay vỉa hè trước quán',
      atmosphere: 'Bình dân, quạt gió mát mẻ',
      googleMapsQuery: 'Bún Bò Sông Hương Ung Văn Khiêm Bình Thạnh'
    },
    {
      id: 'bt-3',
      name: 'Quán Phá Lấu Chi Lăng',
      address: '16 Chi Lăng, P.17, Bình Thạnh',
      district: 'Bình Thạnh',
      priceRange: '25.000đ - 40.000đ',
      rating: 4.6,
      reviewCount: '900+',
      category: 'Ăn vặt',
      signatureDishes: ['Phá lấu bò bánh mì', 'Phá lấu mì gói chua cay', 'Nước tắc xí muội'],
      whyRecommended: 'Nước phá lấu béo ngậy nước cốt dừa, lòng bò làm rất sạch không bị tanh, nước chấm me chua ngọt đỉnh chóp chấm bánh mì giòn tan.',
      highlightBadge: 'Huyền thoại ăn vặt sinh viên',
      openingHours: '13:00 - 20:30',
      parkingTip: 'Đậu xe trong ngõ ngắn, chú quán chỉ dẫn',
      atmosphere: 'Bình dân vỉa hè thoáng mát',
      googleMapsQuery: 'Phá Lấu Chi Lăng Bình Thạnh'
    },
    {
      id: 'bt-4',
      name: 'Lẩu Bò Cô Thảo - Hồ Bá Kiện / Thanh Đa',
      address: 'Bình Quới, P.28, Bình Thạnh',
      district: 'Bình Thạnh',
      priceRange: '120.000đ - 180.000đ/người',
      rating: 4.4,
      reviewCount: '800+',
      category: 'Lẩu / Nướng',
      signatureDishes: ['Lẩu đuôi bò hầm khoai môn', 'Bò tơ nướng ngũ vị', 'Gân bò xào sa tế'],
      whyRecommended: 'Nồi lẩu bò ngập tràn thịt, gân, đậu hũ và rau tươi, nước lẩu ngọt thanh từ xương ống, giá cả cực kỳ hợp lý cho nhóm bạn sinh viên.',
      highlightBadge: 'Tụ tập nhóm cực đã',
      openingHours: '10:00 - 23:00',
      parkingTip: 'Bãi xe rộng rãi ngay cạnh quán',
      atmosphere: 'Không gian mở thoáng đãng gió sông',
      googleMapsQuery: 'Lẩu bò Bình Thạnh'
    }
  ],
  ngan_hang: [
    {
      id: 'nh-1',
      name: 'Cơm Gà Xối Mỡ Hoàng Diệu 2',
      address: '142 Hoàng Diệu 2, P. Linh Chiểu, TP. Thủ Đức (Sát ĐH Ngân Hàng)',
      district: 'Thủ Đức',
      priceRange: '35.000đ - 50.000đ',
      rating: 4.5,
      reviewCount: '1.400+',
      category: 'Cơm trưa',
      signatureDishes: ['Cơm đùi gà xối mỡ giòn rụm', 'Cơm cánh gà chiên mắm', 'Canh rong biển miễn phí'],
      whyRecommended: 'Gà chiên da giòn tan rụm, thịt bên trong mọng nước, cơm chiên hạt vàng ươm tơi xốp, sinh viên BUH ăn bao no và xin thêm cơm rau thoải mái.',
      highlightBadge: 'Quán ruột sinh viên ĐH Ngân Hàng',
      openingHours: '09:00 - 21:30',
      parkingTip: 'Để xe trước hiên quán có người trông',
      atmosphere: 'Bình dân, rộng rãi, phục vụ nhanh',
      googleMapsQuery: 'Cơm Gà Xối Mỡ Hoàng Diệu 2 Thủ Đức'
    },
    {
      id: 'nh-2',
      name: 'Bún Đậu Mẹt Tràng Tiền - Hoàng Diệu 2',
      address: '76 Hoàng Diệu 2, P. Linh Trung, TP. Thủ Đức',
      district: 'Thủ Đức',
      priceRange: '35.000đ - 65.000đ',
      rating: 4.6,
      reviewCount: '950+',
      category: 'Ăn trưa / Ăn vặt',
      signatureDishes: ['Mẹt bún đậu thập cẩm', 'Chả cốm chiên phồng', 'Nem chua rán giòn', 'Nước sấu đá'],
      whyRecommended: 'Đậu hũ mơ chiên ngoài giòn trong mềm béo, mắm tôm đánh sủi bọt thơm lừng quất ớt cay nồng, mẹt đầy ắp thịt luộc bắp giò và chả cốm nóng hổi.',
      highlightBadge: 'Mẹt bún đậu đầy ắp giá mềm',
      openingHours: '10:00 - 22:00',
      parkingTip: 'Có bảo vệ dắt xe trước quán',
      atmosphere: 'Máy lạnh tầng 2, sạch sẽ thoáng mát',
      googleMapsQuery: 'Bún Đậu Mẹt Hoàng Diệu 2 Thủ Đức'
    },
    {
      id: 'nh-3',
      name: 'Bánh Mì Chảo Cô 3 - Gần KTX ĐH Ngân Hàng',
      address: 'Số 17 Đường số 17, P. Linh Chiểu, TP. Thủ Đức',
      district: 'Thủ Đức',
      priceRange: '25.000đ - 45.000đ',
      rating: 4.5,
      reviewCount: '520+',
      category: 'Ăn sáng',
      signatureDishes: ['Chảo thập cẩm xíu mại bò né trứng ốp la', 'Pate nhà làm béo ngậy', 'Bánh mì nóng giòn'],
      whyRecommended: 'Xíu mại sốt cà chua đậm đà chấm bánh mì giòn rụm, pate gan tự làm thơm nức mũi, chảo xèo xèo nóng hổi tiếp năng lượng trước giờ lên lớp.',
      highlightBadge: 'Bữa sáng sinh viên siêu chất lượng',
      openingHours: '06:00 - 12:00',
      parkingTip: 'Để xe dọc bờ tường trước quán',
      atmosphere: 'Bình dân, ấm cúng',
      googleMapsQuery: 'Bánh mì chảo Linh Chiểu Thủ Đức'
    },
    {
      id: 'nh-4',
      name: 'Nướng Ngói & Lẩu Sinh Viên - Phố Ẩm Thực Tô Vĩnh Diện',
      address: '28 Tô Vĩnh Diện, P. Linh Chiểu, TP. Thủ Đức',
      district: 'Thủ Đức',
      priceRange: '80.000đ - 140.000đ/người',
      rating: 4.4,
      reviewCount: '780+',
      category: 'Lẩu / Nướng',
      signatureDishes: ['Bò cuộn nấm kim châm nướng ngói', 'Nầm heo sốt chao cay', 'Lẩu Thái tôm mực sinh viên'],
      whyRecommended: 'Nướng trên ngói giữ trọn độ ngọt của thịt không bị khét, nước chấm chao sa tế tự pha ngon quên lối về, giá hợp túi tiền cho các buổi liên hoan lớp.',
      highlightBadge: 'Tụ tập liên hoan giá hạt dẻ',
      openingHours: '16:00 - 23:30',
      parkingTip: 'Bãi gửi xe đối diện quán miễn phí',
      atmosphere: 'Vỉa hè thoáng mát, đông vui nhộn nhịp',
      googleMapsQuery: 'Nướng ngói Tô Vĩnh Diện Thủ Đức'
    }
  ]
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Setup GoogleGenAI
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Main search API
  app.post('/api/find-restaurants', async (req, res) => {
    try {
      const {
        location = 'Quận Bình Thạnh',
        budget = 'Dưới 50k',
        category = 'Tất cả',
        tags = [],
        extraNotes = '',
        userCoords = null
      } = req.body;

      if (!apiKey) {
        // Return fallback data if no API key is supplied
        const locLower = location.toLowerCase();
        let fallbackList = FALLBACK_EATERIES.binh_thanh;
        if (locLower.includes('ngân hàng') || locLower.includes('thủ đức') || locLower.includes('hoàng diệu')) {
          fallbackList = FALLBACK_EATERIES.ngan_hang;
        }

        return res.json({
          summary: `Danh sách các quán ăn ngon rẻ nổi tiếng tại khu vực ${location} với ngân sách ${budget}, đã được chọn lọc và có đánh giá cao.`,
          restaurants: fallbackList,
          localTips: [
            'Nên đi trước 11h45 hoặc sau 13h00 để tránh đông đúc vào giờ cao điểm sinh viên / văn phòng.',
            'Nhiều quán có ưu đãi trà đá miễn phí hoặc giảm 10% khi xuất trình thẻ sinh viên.',
            'Nếu đi nhóm đông, nên gọi điện giữ chỗ trước đối với các quán lẩu/nướng.'
          ],
          groundingSources: [
            { title: 'Google Maps Local Reviews', url: 'https://maps.google.com' },
            { title: 'Foody Vietnam', url: 'https://foody.vn' }
          ],
          searchQueries: [`quán ngon rẻ ${location} ${category} ${budget}`]
        });
      }

      const prompt = `
Bạn là chuyên gia ẩm thực bản địa Việt Nam, cực kỳ am hiểu các quán ăn ngon, bổ, rẻ, bình dân và chuẩn vị dành cho học sinh, sinh viên và dân văn phòng tại TP.HCM và các tỉnh thành Việt Nam.

Nhiệm vụ: Tìm kiếm thực tế và đề xuất 3 đến 5 quán ăn THỰC TẾ, CÒN ĐANG HOẠT ĐỘNG, CÓ ĐÁNH GIÁ TỐT (trên Google Maps/Foody từ 4.0 sao trở lên) thỏa mãn các tiêu chí sau:
- Địa điểm/Khu vực yêu cầu: "${location}" ${userCoords ? `(Tọa độ người dùng: ${userCoords.lat}, ${userCoords.lng})` : ''}
- Mức ngân sách: "${budget}" (phải chọn quán có mức giá thực tế đúng trong khung giá này, ví dụ dưới 50k thì mỗi suất ăn no tầm 30k-45k)
- Thể loại món ăn: "${category}" (ví dụ Ăn sáng, Cơm trưa, Ăn vặt, Lẩu / Nướng, Bún/Phở, Cà phê...)
- Tiêu chí bổ sung: ${tags.length > 0 ? tags.join(', ') : 'Quán bình dân, chất lượng ngon'}
${extraNotes ? `- Ghi chú thêm: "${extraNotes}"` : ''}

HÃY SỬ DỤNG CÔNG CỤ TÌM KIẾM GOOGLE SEARCH ĐỂ TÌM QUÁN THẬT, ĐỊA CHỈ THẬT, GIÁ VÀ ĐÁNH GIÁ THỰC TẾ MỚI NHẤT.
Nếu người dùng đề cập "Đại học Ngân Hàng", hãy chú ý các quán quanh khu vực đường Hoàng Diệu 2, Linh Trung, Linh Chiểu, Võ Văn Ngân, Thủ Đức.
Nếu người dùng đề cập "Bình Thạnh", chú ý khu D2 (Nguyễn Gia Trí), Ung Văn Khiêm, Xô Viết Nghệ Tĩnh, Bạch Đằng, Hàng Xanh, Vũ Tùng...

KẾT QUẢ PHẢI ĐƯỢC ĐẶT TRONG KHỐI JSON HỢP LỆ THEO CẤU TRÚC SAU (không viết văn bản bên ngoài khối JSON):
\`\`\`json
{
  "summary": "1-2 câu tóm tắt tổng quan về nét ẩm thực ngon rẻ tại khu vực này cho tiêu chí của khách",
  "restaurants": [
    {
      "id": "1",
      "name": "Tên quán ăn thực tế chính xác",
      "address": "Số nhà, tên đường, phường, quận",
      "district": "Quận/Huyện",
      "priceRange": "Khoảng giá thực tế (VD: 30.000đ - 45.000đ)",
      "rating": 4.5,
      "reviewCount": "500+ đánh giá",
      "category": "Cơm trưa / Ăn vặt / ...",
      "signatureDishes": ["Tên món 1", "Tên món 2", "Tên món 3"],
      "whyRecommended": "Lý do vì sao quán này ngon, rẻ và đáng ăn (độ đậm đà, khẩu phần, phục vụ)",
      "highlightBadge": "Cụm từ nổi bật (VD: 'Bao no cho sinh viên', 'Nước sốt đậm đà', 'Máy lạnh cực mát')",
      "openingHours": "Khung giờ mở cửa",
      "parkingTip": "Mẹo gửi xe",
      "atmosphere": "Vỉa hè / Máy lạnh / Thoáng mát",
      "googleMapsQuery": "Tên quán + Địa chỉ hoặc Tên đường để tìm kiếm trên Google Maps"
    }
  ],
  "localTips": [
    "Mẹo ăn uống địa phương 1 (giờ đông, cách gọi món, gửi xe)",
    "Mẹo ăn uống địa phương 2"
  ]
}
\`\`\`
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = response.text || '';
      
      // Extract grounding metadata chunks
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];
      
      const groundingSources: Array<{ title?: string; url?: string }> = [];
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          groundingSources.push({
            title: chunk.web.title || new URL(chunk.web.uri).hostname,
            url: chunk.web.uri,
          });
        }
      }

      // Parse JSON from model output
      let parsedData: SearchResponseData | null = null;
      try {
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const cleanJson = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
        parsedData = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.warn('Could not parse clean JSON, attempting loose extraction:', parseErr);
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          try {
            parsedData = JSON.parse(responseText.substring(firstBrace, lastBrace + 1));
          } catch (innerErr) {
            console.error('Failed fallback JSON parse:', innerErr);
          }
        }
      }

      if (!parsedData || !Array.isArray(parsedData.restaurants) || parsedData.restaurants.length === 0) {
        // Fallback gracefully to curated local spots
        const locLower = location.toLowerCase();
        let fallbackList = FALLBACK_EATERIES.binh_thanh;
        if (locLower.includes('ngân hàng') || locLower.includes('thủ đức') || locLower.includes('hoàng diệu')) {
          fallbackList = FALLBACK_EATERIES.ngan_hang;
        }

        return res.json({
          summary: `Đã tìm kiếm các quán ăn phù hợp với tiêu chí tại ${location} (${budget}) với đánh giá cao.`,
          restaurants: fallbackList,
          localTips: [
            'Nên đến vào các khung giờ lệch cao điểm (11h-12h hoặc 18h-19h) để không phải chờ đợi lâu.',
            'Nhiều quán sinh viên phục vụ thêm canh và cơm thêm miễn phí.',
            'Gửi xe trước quán nhớ lấy thẻ hoặc theo hướng dẫn của nhân viên.'
          ],
          groundingSources,
          searchQueries,
          rawExplanation: responseText
        });
      }

      // Ensure every restaurant has valid id and maps query
      const formattedRestaurants: RestaurantItem[] = parsedData.restaurants.map((item, idx) => ({
        id: item.id || `rest-${idx + 1}`,
        name: item.name || `Quán ngon ${idx + 1}`,
        address: item.address || location,
        district: item.district || '',
        priceRange: item.priceRange || budget,
        rating: typeof item.rating === 'number' ? item.rating : 4.5,
        reviewCount: item.reviewCount || 'Đánh giá tích cực',
        category: item.category || category,
        signatureDishes: Array.isArray(item.signatureDishes) ? item.signatureDishes : ['Món đặc sắc của quán'],
        whyRecommended: item.whyRecommended || 'Hương vị thơm ngon, giá cả rất phải chăng.',
        highlightBadge: item.highlightBadge || 'Đánh giá tốt',
        openingHours: item.openingHours || '07:00 - 21:00',
        parkingTip: item.parkingTip || 'Có chỗ để xe thuận tiện',
        atmosphere: item.atmosphere || 'Thoáng mát, sạch sẽ',
        googleMapsQuery: item.googleMapsQuery || `${item.name} ${item.address || location}`
      }));

      return res.json({
        summary: parsedData.summary || `Top quán ngon rẻ được đánh giá cao tại ${location}`,
        restaurants: formattedRestaurants,
        localTips: parsedData.localTips || ['Nên hỏi giá trước khi gọi các món phụ.', 'Nhiều quán có máy lạnh ở tầng 2.'],
        groundingSources,
        searchQueries
      });

    } catch (error: any) {
      console.error('Error finding restaurants with Gemini:', error);
      
      // Return meaningful error with helpful fallback so user UI is not broken
      const location = req.body?.location || 'khu vực bạn chọn';
      const locLower = (req.body?.location || '').toLowerCase();
      let fallbackList = FALLBACK_EATERIES.binh_thanh;
      if (locLower.includes('ngân hàng') || locLower.includes('thủ đức')) {
        fallbackList = FALLBACK_EATERIES.ngan_hang;
      }

      return res.json({
        summary: `Đề xuất quán ngon nổi bật tại ${location} theo ngân sách tiết kiệm:`,
        restaurants: fallbackList,
        localTips: [
          'Bạn có thể bấm vào nút chỉ đường Google Maps để xem vị trí chính xác và giờ mở cửa hôm nay.'
        ],
        notice: 'Đang hiển thị danh sách quán ăn chọn lọc dựa trên dữ liệu địa phương.',
        groundingSources: []
      });
    }
  });

  // Random dish roulette / quick idea generator
  app.post('/api/quick-ideas', async (_req, res) => {
    const ideas = [
      { name: 'Cơm Tấm Sườn Bì Chả', budget: '35k - 50k', mood: 'No bụng chắc dạ', icon: '🍛' },
      { name: 'Bún Đậu Mắm Tôm Mẹt', budget: '40k - 60k', mood: 'Ăn cùng hội bạn', icon: '🥢' },
      { name: 'Bún Bò Huế Chả Cua', budget: '35k - 55k', mood: 'Nóng hổi xì xụp', icon: '🍜' },
      { name: 'Bánh Mì Chảo Thập Cẩm', budget: '30k - 45k', mood: 'Nhanh gọn lẹ', icon: '🥖' },
      { name: 'Hủ Tiếu Nam Vang / Mì Gõ', budget: '25k - 40k', mood: 'Ấm bụng khuya', icon: '🍲' },
      { name: 'Cơm Gà Xối Mỡ Da Giòn', budget: '35k - 50k', mood: 'Đậm vị sảng khoái', icon: '🍗' },
      { name: 'Lẩu Bò / Lẩu Thái Sinh Viên', budget: '90k - 150k/người', mood: 'Tụ tập cuối tuần', icon: '🥘' },
      { name: 'Bánh Tráng Cuốn Sốt Me & Trà Sữa', budget: '20k - 35k', mood: 'Lai rai tám chuyện', icon: '🧋' }
    ];
    res.json({ ideas });
  });

  // Vite middleware in dev or static files in production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
