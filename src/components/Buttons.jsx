import { Button } from '@mui/material'
import React from 'react'

function Buttons({text, onClick, type}) {
    return (
        <Button
            sx={{
                backgroundColor: type == 1 ? "white" : "#437c99",
                color: type == 1 ? "#437c99" : "white",
                borderColor: type == 1 ? "#437c99" : ""
            }}
            variant="outlined"
            className="!text-sm !font-YekanBakh_Bold "
            onClick={onClick}
        >
            {text}
        </Button>
    )
}

export default Buttons
