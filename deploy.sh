cd /root/ecom-tpop 
git pull origin main 

cd backend 
npm install 

pm2 restart backend 
cd ..

cd frontend
npm install 
npm run build 

sudo rm -rf /var/www/ecom-tpop/frontend/build
sudo mkdir -p /var/www/ecom-tpop/frontend
sudo cp -r build /var/www/ecom-tpop/frontend/
sudo chown -R www-data:www-data /var/www/ecom-tpop

cd ..

sudo systemctl reload nginx

echo "Deployment Complete! Visit your site to see the changes "
