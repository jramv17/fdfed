const Post = require('../Models/PostModel');
const PostController = require('../Controllers/PostController');

jest.mock('../Models/PostModel');

describe('PostController', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('createPost', () => {
        it('should return 400 if file is missing', async () => {
            mockReq = {
                body: { title: 'Test', description: 'Desc', apartment_id: 'A1' },
                file: null
            };

            await PostController.createPost(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'File is required' });
        });

        it('should create a post if file is present', async () => {
            mockReq = {
                body: { title: 'Test', description: 'Desc', apartment_id: 'A1' },
                file: { filename: 'file.png' }
            };

            Post.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(true),
            }));

            await PostController.createPost(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Post created successfully',
                    post: expect.any(Object)
                })
            );
        });
    });

    describe('getPosts', () => {
        it('should return posts sorted by createdAt', async () => {
            mockReq = { params: { apartment_id: 'A1' } };
            const mockPosts = [{ title: 'Post1' }, { title: 'Post2' }];
            Post.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    select: jest.fn().mockResolvedValue(mockPosts)
                })
            });

            await PostController.getPosts(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockPosts);
        });
    });

    describe('likePost', () => {
        it('should return 404 if post is not found', async () => {
            mockReq = { params: { postId: '123' }, id: 'user123' };
            Post.findById.mockResolvedValue(null);

            await PostController.likePost(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post not found' });
        });

        it('should return already liked if user already liked post', async () => {
            mockReq = { params: { postId: '123' }, id: 'user123' };
            Post.findById.mockResolvedValue({
                likedIPs: ['user123'],
            });

            await PostController.likePost(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'User has already liked this post' });
        });

        it('should like post if not already liked', async () => {
            const saveMock = jest.fn().mockResolvedValue(true);
            mockReq = { params: { postId: '123' }, id: 'user456' };
            Post.findById.mockResolvedValue({
                likes: 0,
                likedIPs: [],
                save: saveMock,
            });

            await PostController.likePost(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post liked', likes: 1 });
        });
    });

    describe('addComment', () => {
        it('should return 404 if post not found', async () => {
            mockReq = { params: { postId: '123' }, body: { text: 'Nice post!' } };
            Post.findById.mockResolvedValue(null);

            await PostController.addComment(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post not found' });
        });

        it('should add comment to the post', async () => {
            const saveMock = jest.fn().mockResolvedValue(true);
            mockReq = { params: { postId: '123' }, body: { text: 'Nice post!' } };
            const mockPost = { comments: [], save: saveMock };

            Post.findById.mockResolvedValue(mockPost);

            await PostController.addComment(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Comment added',
                comments: expect.arrayContaining([{ text: 'Nice post!' }])
            });
        });
    });
});
