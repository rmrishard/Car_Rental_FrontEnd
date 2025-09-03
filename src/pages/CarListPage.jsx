import React, { useState, useMemo } from 'react'
import { Typography, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material'
import { useGetCars } from '../api/car/car'
import CarCard from '../CarCard'

function CarListPage() {
  const { data: carsResponse, isLoading, error } = useGetCars()
  const [selectedType, setSelectedType] = useState('all')
  
  console.log('CarListPage - Loading:', isLoading, 'Error:', error, 'Full Response:', carsResponse)
  console.log('CarListPage - Response data type:', typeof carsResponse?.data, 'Is array:', Array.isArray(carsResponse?.data))
  
  let allCars = []
  if (carsResponse?.data) {
    if (Array.isArray(carsResponse.data)) {
      allCars = carsResponse.data
    } else if (Array.isArray(carsResponse)) {
      allCars = carsResponse
    } else {
      console.warn('Unexpected data structure:', carsResponse)
    }
  }

  // Get unique car types for filter options
  const carTypes = useMemo(() => {
    const types = [...new Set(allCars.map(car => car.type).filter(type => type && type.trim() !== ''))]
    return types.sort()
  }, [allCars])

  // Filter cars based on selected type
  const filteredCars = useMemo(() => {
    if (selectedType === 'all') {
      return allCars
    }
    return allCars.filter(car => car.type === selectedType)
  }, [allCars, selectedType])

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value)
  }
  

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">Error loading cars</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ padding: 3, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Available Cars
        </Typography>
        <FormControl sx={{ 
          minWidth: 200,
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: 'white' },
            '&.Mui-focused fieldset': { borderColor: 'white' }
          },
          '& .MuiInputBase-input': { color: 'white' },
          '& .MuiSvgIcon-root': { color: 'white' }
        }}>
          <InputLabel sx={{ color: 'white' }}>Filter by Type</InputLabel>
          <Select
            value={selectedType}
            label="Filter by Type"
            onChange={handleTypeChange}
            sx={{ color: 'white' }}
          >
            <MenuItem value="all">All Types</MenuItem>
            {carTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {selectedType !== 'all' && (
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={`Filtered by: ${selectedType}`}
            onDelete={() => setSelectedType('all')}
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(3, 1fr)' 
        },
        gap: 3
      }}>
        {filteredCars.map((car, index) => (
          <CarCard key={car.id || index} car={car} />
        ))}
      </Box>
      {filteredCars.length === 0 && allCars.length > 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="h6">
            No cars found for the selected type
          </Typography>
        </Box>
      )}
      {allCars.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="h6">
            No cars available
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default CarListPage