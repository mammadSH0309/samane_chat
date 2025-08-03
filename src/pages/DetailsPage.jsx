import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../service/handleToken";
import { ChannelList } from "../components/ChannelList";

const faPlatform = (en) => {
  switch (en) {
    case "bale":
      return "بله";
    case "eitaa":
      return "ایتا";
    case "gap":
      return "گپ";
    case "soroush":
      return "سروش";
    default:
      return en;
  }
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { input, date, image } = location.state || {};

  const [tab, setTab] = useState(0);
  const [selectedType, setSelectedType] = useState("channel");

  // checked و checkedCategories مثل قبل
  const [checked, setChecked] = useState({ channel: {}, group: {} });
  const [checkedCategories, setCheckedCategories] = useState({ channel: {}, group: {} });

  // همه کانال‌ها و گروه‌ها بدون توجه به نوع
  const { data: allChannels, isLoading, error } = useQuery({
    queryKey: ["channelsAll"],
    queryFn: async () => (await api.get(`/sapi/dist/channels/`)).data,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // فقط دسته‌بندی‌ها
  const { data: categories, isLoading: catLoading, error: catError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/sapi/dist/category/")).data,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // ساختار داده‌ها تمیز شده با platform کوچیک
  const cleanedAllChannels = useMemo(() => {
    return (
      allChannels?.map((i) => ({
        ...i,
        platform: i.platform.trim().toLowerCase(),
      })) || []
    );
  }, [allChannels]);

  // همه پلتفرم‌ها بدون توجه به نوع - همیشه ثابت بمونه
  const platforms = useMemo(() => {
    const setPlatform = new Set(cleanedAllChannels.map((i) => i.platform));
    return Array.from(setPlatform);
  }, [cleanedAllChannels]);

  // Items فیلتر شده بر اساس selectedType و platform فعلی (tab)
  const filteredItems = useMemo(() => {
    if (!platforms[tab]) return [];
    return cleanedAllChannels.filter(
      (i) => i.platform === platforms[tab] && i.type === selectedType
    );
  }, [cleanedAllChannels, platforms, tab, selectedType]);

  // اگر tab خارج از محدوده platforms بود اصلاحش کنیم
  useEffect(() => {
    if (platforms.length > 0 && (tab >= platforms.length || tab < 0)) {
      setTab(0);
    }
  }, [platforms, tab]);

  // مقداردهی اولیه checked و checkedCategories برای selectedType
  useEffect(() => {
    setChecked((prev) => {
      if (prev[selectedType]) return prev;
      return {
        ...prev,
        [selectedType]: {},
      };
    });
    setCheckedCategories((prev) => {
      if (prev[selectedType]) return prev;
      return {
        ...prev,
        [selectedType]: {},
      };
    });
  }, [selectedType]);

  const handleCheck = useCallback(
    (platform, id) => {
      setChecked((prev) => {
        const prevSelectedType = prev[selectedType] || {};
        const prevPlatform = prevSelectedType[platform] || [];

        const isChecked = prevPlatform.includes(id);

        const newPlatformList = isChecked
          ? prevPlatform.filter((item) => item !== id)
          : [...prevPlatform, id];

        return {
          ...prev,
          [selectedType]: {
            ...prevSelectedType,
            [platform]: newPlatformList,
          },
        };
      });
    },
    [selectedType]
  );

  const handleCategoryCheck = useCallback(async (catId) => {
    const currentPlatform = platforms[tab]; // پلتفرم فعلی
    const platformCheckedCats = checkedCategories[currentPlatform] || [];
    const isAlreadyChecked = platformCheckedCats.includes(catId);

    try {
      // دریافت کانال‌های دسته بر اساس نوع و دسته
      const res = await api.get(`/sapi/dist/channels/?category=${catId}&type=${selectedType}`);
      const catChannels = res.data.filter(ch => ch.platform.trim().toLowerCase() === currentPlatform);

      setChecked((prev) => {
        const updated = { ...prev };
        if (!updated[selectedType]) updated[selectedType] = {};
        if (!updated[selectedType][currentPlatform]) updated[selectedType][currentPlatform] = [];

        const prevPlatformChecked = updated[selectedType][currentPlatform];

        let newPlatformChecked;
        if (isAlreadyChecked) {
          // حذف کانال‌های دسته از checked[selectedType][currentPlatform]
          newPlatformChecked = prevPlatformChecked.filter(id => !catChannels.some(ch => ch.id === id));
        } else {
          // اضافه کردن کانال‌های دسته به checked[selectedType][currentPlatform]
          const idsToAdd = catChannels.map(ch => ch.id).filter(id => !prevPlatformChecked.includes(id));
          newPlatformChecked = [...prevPlatformChecked, ...idsToAdd];
        }

        updated[selectedType][currentPlatform] = newPlatformChecked;
        return updated;
      });

      setCheckedCategories((prev) => {
        const prevCats = prev[currentPlatform] || [];
        let newCats;
        if (isAlreadyChecked) {
          newCats = prevCats.filter(id => id !== catId);
        } else {
          newCats = [...prevCats, catId];
        }
        return {
          ...prev,
          [currentPlatform]: newCats,
        };
      });
    } catch (err) {
      console.error("❌ خطا در تغییر دسته:", err);
    }
  }, [checkedCategories, selectedType, platforms, tab]);


  const postData = async (data) => {
    const selectedIds = Object.values(checked[selectedType] || {}).flat();
    if (!selectedIds.length) {
      throw new Error("❌ کانال‌ها الزامی هستند و نباید خالی باشند");
    }
    const formData = new FormData();
    formData.append("caption", data.caption || "");
    formData.append("scheduled_time", data.scheduled_time || "");
    formData.append("sent", data.sent ?? "");
    selectedIds.forEach((ch) => formData.append("channels", ch));
    // اضافه کردن دسته‌ها
    const cats = checkedCategories[selectedType]
      ? Object.values(checkedCategories[selectedType]).flat()
      : [];
    cats.forEach((cat) => formData.append("category", cat));
    if (data.media) formData.append("media", data.media);
    const response = await api.post("/sapi/dist/send-posts/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    },
    onError: (error) => console.error("❌ خطا در ارسال:", error),
  });

  const handlePost = () => {
    const dataToSend = {
      caption: input,
      media: image,
      scheduled_time: date?.split(".")[0],
      sent: false,
    };
    mutation.mutate(dataToSend);
  };

  if (error || catError)
    return (
      <Box p={3} color="red">
        خطا در دریافت داده
      </Box>
    );

  return (
    <>
      <Button
        onClick={handlePost}
        sx={{
          display: { xs: "none", sm: "flex" },
          position: "fixed",
          left: 120,
          fontFamily: "Ray",
          top: 140,
          zIndex: 1000,
          backgroundColor: "#4f6f52",
          color: "white",
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        ارسال
      </Button>

      <Button
        onClick={handlePost}
        sx={{
          display: { xs: "block", sm: "none" },
          width: "100%",
          position: "fixed",
          bottom: 0,
          fontFamily: "Ray",
          left: 0,
          backgroundColor: "#4f6f52",
          color: "white",
          py: 1.5,
          borderRadius: 0,
          zIndex: 1000,
        }}
      >
        ارسال
      </Button>

      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{
          display: { xs: "none", sm: "flex" },
          position: "fixed",
          left: 20,
          fontFamily: "Ray",
          top: 140,
          zIndex: 1000,
          backgroundColor: "#4f6f52",
          color: "white",
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        بازگشت
      </Button>

      <Grid container size={12}>
        <Grid size={3}>
          <Box


            sx={{
              width: 350,
              bgcolor: "white",
              borderLeft: "1px solid #eee",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              fontFamily: "Ray",


            }}
          >
            {/* تب پلتفرم همیشه بر اساس کل داده‌ها */}
            <Tabs
              value={tab}
              onChange={(_, newValue) => setTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderColor: "divider", borderTop: "1px solid #eee", // ✅ اضافه کن
                borderBottom: "1px solid #eee",
              }}
            >
              {platforms.map((platform) => (
                <Tab key={platform} label={faPlatform(platform)} sx={{ fontSize: 15, fontFamily: "Ray", }} />
              ))}
            </Tabs>

            {/* تب نوع (چنل/گروه) */}
            <Tabs
              value={selectedType}
              onChange={(_, newValue) => setSelectedType(newValue)}
              variant="fullWidth"
              sx={{
                borderColor: "divider", backgroundColor: '#f5efe6', width: '100%',
                borderTop: "1px solid #eee", // ✅ اضافه کن
                borderBottom: "1px solid #eee",
              }}
            >
              <Tab value="channel" label="کانال" sx={{ fontFamily: "Ray", fontSize: 15 }} />
              <Tab value="group" label="گروه" sx={{ fontFamily: "Ray", fontSize: 15 }} />
            </Tabs>

            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    checked[selectedType]?.[platforms[tab]]?.length === filteredItems.length &&
                    filteredItems.length > 0
                  }
                  indeterminate={
                    checked[selectedType]?.[platforms[tab]]?.length > 0 &&
                    checked[selectedType]?.[platforms[tab]]?.length < filteredItems.length
                  }
                  onChange={() => {
                    const currentPlatform = platforms[tab];
                    const isAllChecked =
                      checked[selectedType]?.[currentPlatform]?.length === filteredItems.length;

                    if (isAllChecked) {
                      setChecked((prev) => ({
                        ...prev,
                        [selectedType]: {
                          ...prev[selectedType],
                          [currentPlatform]: [],
                        },
                      }));
                      setCheckedCategories((prev) => {
                        const prevCatsForType = prev[selectedType] || {};
                        return {
                          ...prev,
                          [selectedType]: {
                            ...prevCatsForType,
                            [currentPlatform]: [],
                          },
                        };
                      });
                    } else {
                      const allIds = filteredItems.map((i) => i.id);

                      setChecked((prev) => ({
                        ...prev,
                        [selectedType]: {
                          ...prev[selectedType],
                          [currentPlatform]: allIds,
                        },
                      }));
                    }
                  }}

                  color="primary"
                />
              }

              sx={{
                paddingRight: 1,
                '& .MuiFormControlLabel-label': {
                  fontFamily: 'Ray',



                }
              }
              }
              label="انتخاب همه"
            />

            <Box

              sx={{ display: "flex", flexDirection: "column", fontFamily: "Ray", paddingRight: 1, }}
            >
              {categories?.map((cat) => (
                <FormControlLabel
                  className="font-Ray"
                  key={cat.id}
                  control={
                    <Checkbox
                      checked={(checkedCategories[platforms[tab]] || []).includes(cat.id)}
                      onChange={() => handleCategoryCheck(cat.id)}
                      color="primary"
                    />
                  }
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: 'Ray',



                    }
                  }
                  }
                  label={cat.name}

                />
              ))}
            </Box>

            {filteredItems.length === 0 ? (
              <Typography sx={{ fontFamily: 'ray' }} fontSize={16} mt={2} color="gray" fontFamily="Ray" textAlign="center">
                {selectedType === "group"
                  ? `برای ${faPlatform(platforms[tab])} گروهی وجود ندارد.`
                  : `برای ${faPlatform(platforms[tab])} چنلی وجود ندارد.`}
              </Typography>
            ) : (
              <>
                <Box className='pr-[47px]'>
                  <ChannelList
                    items={filteredItems}
                    checked={checked[selectedType] || {}}
                    onCheck={(id) => handleCheck(platforms[tab], id)}
                    platform={platforms[tab]}
                    selectedType={selectedType}
                  />
                </Box>
              </>
            )}
          </Box>
        </Grid>
        <Grid className='' size={9}>

        </Grid>

      </Grid>
    </>
  );
}



