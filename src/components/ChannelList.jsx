import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

export const ChannelList = ({ items, checked, onCheck, platform, selectedType }) => {
    return (
        <Box sx={{ fontFamily: "YekanBakh_Regular", fontSize: 5}}>
            {items.map((item) => (
                <FormControlLabel
                    key={item.id}
                    control={
                        <Checkbox

                            sx={{
                                '& .MuiFormControlLabel-label': {
                                    fontFamily: 'YekanBakh_Regular',



                                }
                            }
                            }
                            checked={checked[platform]?.includes(item.id) || false}
                            onChange={() => onCheck(item.id)}
                            color="success"
                        />
                    }
                    sx={{ display: "flex", justifyContent: "flex-start", fontFamily: "YekanBakh_Regular", fontSize: 5 }}
                    label={<Typography sx={{fontFamily : 'YekanBakh_Regular'}} fontSize={13}>{item.name}</Typography>}
                />
            ))}
        </Box>
    );
};