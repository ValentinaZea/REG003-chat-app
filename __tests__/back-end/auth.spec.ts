import { prismaMock } from '../../singleton';
import { authController } from '../../controller/auth';
import { secret } from '../../config'

const mockResponse: any = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.links = jest.fn().mockReturnValue(res);
  res.json = jest.fn((body) => body);
  return res;
};
// TODO: CREATE USER IN MOCK DB
describe('Auth Controller', () => {
  it('should return 200 ', async () => {
    const req: any = {
      body: {
        email: 'email@gmail.com',
        password: '1234567'
      }
    }
    const res = mockResponse()
    const user = { id: 1, email: 'email@gmail.com', username: 'email', password: '$2b$10$phIT8PFGPPEfA4b3/v11wuMDM8.pfmynhzJlFIDUObl3FK0CTcdgq', profile_image: '' }
    prismaMock.user.findUnique.mockResolvedValue(user)
    await authController(req, res)
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

  })
  it('should be return 400 password wrong ', async () => {
    const req: any = {
      body: {
        email: 'email@gmail.com',
        password: '1234567'
      }
    }
    const res = mockResponse()
    const user = { id: 1, email: 'email@gmail.com', username: 'email', password: '$2b$10$phIT8PFGPPEfA4b3/v11wuMDM8.pfmynhzJlFIDUObl', profile_image: '' }
    prismaMock.user.findUnique.mockResolvedValue(user)
    const token = await authController(req, res)
    expect(res.json).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  })
  it('should be return 500 serverError ', async () => {
    const req: any = {
      body: {
        email: 'email@gmail.com',
        password: '1234567'
      }
    }
    const res = mockResponse()
    const error = { message: 'ERROR' }
    prismaMock.user.findUnique.mockRejectedValue(error)
    const token = await authController(req, res)
    expect(res.json).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  })
  it('should be return 400 no body', async () => {
    const req: any = {
      body: {}
    }
    const res = mockResponse()
    const user = { id: 1, email: 'email@gmail.com', username: 'email', password: '$2b$10$phIT8PFGPPEfA4b3/v11wuMDM8.pfmynhzJlFIDUObl', profile_image: '' }
    prismaMock.user.findUnique.mockResolvedValue(user)
    await authController(req, res)
    expect(res.json).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  })
})
