// flushKardz/next.config.mjs

/* Copyright (C) 2024 Lloyd Chang - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the AGPLv3 license.
 *
 * You should have received a copy of the AGPLv3 license with
 * this file. If not, please visit: https://www.gnu.org/licenses/agpl-3.0.html
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/success',
        destination: '/result?redirectTo=success',
        permanent: false,
      },
      {
        source: '/cancel',
        destination: '/result?redirectTo=cancel',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
