const express = require('express');
const router = express.Router();
const {
    createJobMiddleware,
    getJobMiddleware,
    getAllJobs,
    updateJobMiddleware,
    deleteJobMiddleware,
    getJobInterviews
} = require('../controllers/jobController');

/**
 * @route   GET /api/jobs/all
 * @desc    Get all jobs with interview stats
 * @access  Public
 */
router.get('/all', getAllJobs);

/**
 * @route   POST /api/jobs/create
 * @desc    Create a new job posting and get interview link
 * @access  Public
 */
router.post('/create', createJobMiddleware);

/**
 * @route   GET /api/jobs/:id
 * @desc    Get job details by ID
 * @access  Public
 */
router.get('/:id', getJobMiddleware);

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update job details
 * @access  Public
 */
router.put('/:id', updateJobMiddleware);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete job and associated interviews
 * @access  Public
 */
router.delete('/:id', deleteJobMiddleware);

/**
 * @route   GET /api/jobs/:id/interviews
 * @desc    Get all interviews for a specific job
 * @access  Public
 */
router.get('/:id/interviews', getJobInterviews);

/**
 * @route   GET /api/jobs/check/health
 * @desc    Health check for jobs service
 * @access  Public
 */
router.get('/check/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Jobs Service',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
